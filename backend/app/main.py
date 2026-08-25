import json
import os
from pathlib import Path
from typing import List, Optional, Tuple

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from pydantic import BaseModel, Field
from sentence_transformers import SentenceTransformer


# ---------------------------------------------------------------------------
# Relevance threshold: chunks below this cosine score are considered irrelevant
# and will not be sent to the LLM as evidence.
# ---------------------------------------------------------------------------
MIN_RETRIEVAL_SCORE = 0.28


class AskRequest(BaseModel):
    question: str = Field(min_length=8, max_length=800)


class Source(BaseModel):
    title: str
    section: str
    snippet: str
    score: float


class AskResponse(BaseModel):
    answer: str
    sources: List[Source]


class JobMatchRequest(BaseModel):
    job_description: str = Field(min_length=80, max_length=4000)


class JobMatchResponse(BaseModel):
    score: int
    summary: str
    highlights: List[str]
    matched_projects: List[str]
    matched_skills: List[str]


class ContentDoc(BaseModel):
    id: str
    title: str
    section: str
    text: str
    tags: List[str]
    url: Optional[str] = None


# ---------------------------------------------------------------------------
# Data loading
# ---------------------------------------------------------------------------

def _load_content(content_path: Path) -> Tuple[List[ContentDoc], Optional[str]]:
    if not content_path.exists():
        raise FileNotFoundError(f"Missing content file at {content_path}")

    with content_path.open("r", encoding="utf-8") as handle:
        payload = json.load(handle)

    docs = [ContentDoc(**doc) for doc in payload.get("documents", [])]
    if not docs:
        raise ValueError("Content file does not contain any documents")

    profile_summary = payload.get("profile_summary", None)
    return docs, profile_summary


def _embed_docs(model: SentenceTransformer, docs: List[ContentDoc]) -> np.ndarray:
    texts = [f"{doc.title}. {doc.text}" for doc in docs]
    return model.encode(texts, normalize_embeddings=True)


def _ensure_llm_ready(api_key: str | None, mock_llm: bool) -> None:
    if mock_llm:
        return
    if not api_key or not api_key.strip():
        raise HTTPException(status_code=503, detail="Missing GROQ_API_KEY for LLM requests")


# ---------------------------------------------------------------------------
# Retrieval helpers
# ---------------------------------------------------------------------------

def _retrieve(
    embedder: SentenceTransformer,
    docs: List[ContentDoc],
    doc_embeddings: np.ndarray,
    query: str,
    top_k: int,
    min_score: float = MIN_RETRIEVAL_SCORE,
) -> Tuple[List[Source], bool]:
    """
    Retrieve the top-K most relevant chunks for a query.
    Returns (sources, out_of_scope).
    out_of_scope=True means no chunk crossed the minimum relevance threshold.
    """
    query_vec = embedder.encode([query], normalize_embeddings=True)[0]
    scores = doc_embeddings @ query_vec
    top_indices = np.argsort(scores)[::-1][:top_k]

    sources: List[Source] = []
    for index in top_indices:
        score = float(scores[int(index)])
        if score < min_score:
            continue  # Skip irrelevant chunks
        doc = docs[int(index)]
        snippet = doc.text[:280].rstrip()
        sources.append(
            Source(
                title=doc.title,
                section=doc.section,
                snippet=snippet,
                score=score,
            )
        )

    out_of_scope = len(sources) == 0
    return sources, out_of_scope


def _retrieve_by_section(
    embedder: SentenceTransformer,
    docs: List[ContentDoc],
    doc_embeddings: np.ndarray,
    query: str,
    section: str,
    top_k: int,
    min_score: float = 0.0,  # No hard threshold for section-filtered retrieval
) -> List[ContentDoc]:
    """Retrieve top-K docs from a specific section by semantic similarity."""
    query_vec = embedder.encode([query], normalize_embeddings=True)[0]
    scores = doc_embeddings @ query_vec

    filtered = [
        (doc, float(scores[i]))
        for i, doc in enumerate(docs)
        if doc.section == section and float(scores[i]) >= min_score
    ]

    ranked = sorted(filtered, key=lambda item: item[1], reverse=True)
    return [doc for doc, _ in ranked[:top_k]]


# ---------------------------------------------------------------------------
# /api/ask LLM answer generation
# ---------------------------------------------------------------------------

_OUT_OF_SCOPE_RESPONSE = (
    "That topic doesn't appear to be covered in Naman's portfolio data. "
    "I can only answer questions about his documented work experience, skills, projects, education, and achievements. "
    "Feel free to ask me anything about his AI engineering work, full-stack development projects, or professional background!"
)


def _groq_answer(
    client: Groq,
    model: str,
    question: str,
    source_docs: List[ContentDoc],
    profile_summary: Optional[str],
) -> str:
    context = "\n\n".join(
        [f"[{doc.section.upper()}] {doc.title}\n{doc.text}" for doc in source_docs]
    )

    system_prompt = (
        "You are Naman Singh Panwar's AI Portfolio Assistant. Your ONLY job is to answer questions "
        "strictly and truthfully about Naman's documented work experience, skills, projects, and achievements.\n\n"
    )

    if profile_summary:
        system_prompt += (
            "=== NAMAN'S VERIFIED PROFILE (Ground Truth) ===\n"
            f"{profile_summary}\n\n"
        )

    system_prompt += (
        "=== STRICT RULES — VIOLATION IS NOT ALLOWED ===\n"
        "1. ONLY use information present in the context chunks or profile summary above. Do NOT use general world knowledge about Naman or any guesses.\n"
        "2. If a skill, technology, or domain is listed under 'SKILLS NOT IN PORTFOLIO', you MUST say Naman does NOT have experience in it. Never claim he does.\n"
        "3. If the question is about a domain completely absent from the context (e.g. quantum computing, digital marketing, corporate training, cybersecurity), respond: "
        "'That is outside Naman's documented portfolio. He specializes in [relevant actual skills].'\n"
        "4. EXPERIENCE CALCULATION RULES (follow precisely):\n"
        "   - If asked about AI/ML experience specifically: GyanNetra (current) + DRDO 2 months + Microsoft 1 month + Ideaforage 6 months = approx 9+ months of AI-focused work.\n"
        "   - If asked about web/frontend experience specifically: AI R&D Division 8 months + Gyannetra Web Dev 2 months = approx 10 months.\n"
        "   - If asked about TOTAL overall experience: ~20 months across all roles.\n"
        "   - NEVER report total experience when asked about a specific domain.\n"
        "5. For Tokenarium: clarify it is a frontend UI project, NOT professional blockchain/smart contract experience.\n"
        "6. For 'emerging AI technologies' at Ideaforage: this refers specifically to LLMs, RAG, and agentic AI — not quantum computing, digital marketing, or corporate training.\n"
        "7. If information is not in the provided context, say 'I don't have that information in Naman's portfolio data.'\n"
        "8. Be precise, honest, professional. Do not over-claim or invent achievements.\n"
        "9. Keep answers focused and between 3-8 sentences unless a list is genuinely needed."
    )

    user_prompt = (
        f"Question: {question}\n\n"
        "=== RETRIEVED PORTFOLIO CONTEXT ===\n"
        f"{context}"
    )

    completion = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.1,  # Very low temperature for factual grounding
        max_tokens=600,
    )

    return completion.choices[0].message.content.strip()


def _mock_answer(question: str, sources: List[ContentDoc]) -> str:
    titles = ", ".join([doc.title for doc in sources])
    return (
        "Mock response for development. "
        f"Question: {question}. "
        f"Sources: {titles}."
    )


# ---------------------------------------------------------------------------
# /api/job-match LLM scoring (LLM-grounded, not raw cosine math)
# ---------------------------------------------------------------------------

def _groq_job_match(
    client: Groq,
    model: str,
    job_description: str,
    profile_summary: str,
    top_projects: List[ContentDoc],
    top_skills: List[ContentDoc],
    top_experience: List[ContentDoc],
) -> dict:
    """
    Ask the LLM to perform an honest, grounded job match analysis.
    Returns a dict with: score, summary, highlights, matched_projects, matched_skills.
    """
    project_context = "\n".join(
        [f"- {doc.title}: {doc.text}" for doc in top_projects]
    )
    skill_context = "\n".join(
        [f"- {doc.title}: {doc.text}" for doc in top_skills]
    )
    experience_context = "\n".join(
        [f"- {doc.title}: {doc.text}" for doc in top_experience]
    )

    system_prompt = (
        "You are an honest, rigorous recruiting analyst. Your job is to assess how well a candidate's "
        "DOCUMENTED portfolio matches a given job description.\n\n"
        "CRITICAL RULES — these are non-negotiable:\n"
        "1. Base your analysis EXCLUSIVELY on the candidate's documented profile, skills, projects, and experience provided below.\n"
        "2. Do NOT infer, assume, or extrapolate skills the candidate has not explicitly documented.\n"
        "3. If the job description requires skills the candidate has NO documented experience in "
        "(e.g. digital marketing, quantum computing, corporate training, blockchain engineering), "
        "you MUST reflect this as a significant gap, reducing the score substantially.\n"
        "4. The score (0-100) must reflect ACTUAL skill overlap, not potential or general intelligence.\n"
        "   - 0-15: Almost no relevant skills overlap (e.g. completely different domain)\n"
        "   - 16-40: Minimal overlap, major skills missing\n"
        "   - 41-65: Partial match, several key skills missing\n"
        "   - 66-80: Good match, minor gaps\n"
        "   - 81-100: Strong match, candidate clearly qualified\n"
        "5. Only list a project or skill as 'matched' if it genuinely aligns with the job requirements.\n"
        "6. If skills mentioned in the SKILLS NOT IN PORTFOLIO section of the profile are required by the JD, "
        "explicitly mention those as gaps in the summary.\n\n"
        "Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):\n"
        "{\n"
        '  "score": <integer 0-100>,\n'
        '  "summary": "<3-5 sentence honest assessment>",\n'
        '  "highlights": ["<genuine strength 1>", "<genuine strength 2>"],\n'
        '  "matched_projects": ["<project name if relevant>"],\n'
        '  "matched_skills": ["<skill name if relevant>"]\n'
        "}\n\n"
        "If there are NO matched projects or skills, return empty arrays []."
    )

    user_prompt = (
        "=== JOB DESCRIPTION ===\n"
        f"{job_description}\n\n"
        "=== CANDIDATE'S VERIFIED PROFILE ===\n"
        f"{profile_summary}\n\n"
        "=== CANDIDATE'S TOP POTENTIALLY RELEVANT PROJECTS ===\n"
        f"{project_context if project_context else 'None retrieved.'}\n\n"
        "=== CANDIDATE'S TOP POTENTIALLY RELEVANT SKILLS ===\n"
        f"{skill_context if skill_context else 'None retrieved.'}\n\n"
        "=== CANDIDATE'S TOP POTENTIALLY RELEVANT EXPERIENCE ===\n"
        f"{experience_context if experience_context else 'None retrieved.'}\n\n"
        "Now perform the honest match analysis and return ONLY the JSON object."
    )

    completion = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.1,
        max_tokens=700,
    )

    raw = completion.choices[0].message.content.strip()

    # Strip markdown code fences if the LLM adds them
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        # Fallback: if JSON parsing fails, return a safe default
        result = {
            "score": 0,
            "summary": "Unable to parse the AI analysis. Please try again.",
            "highlights": [],
            "matched_projects": [],
            "matched_skills": [],
        }

    # Clamp score to valid range
    result["score"] = max(0, min(100, int(result.get("score", 0))))
    return result


# ---------------------------------------------------------------------------
# App factory
# ---------------------------------------------------------------------------

def create_app() -> FastAPI:
    app_instance = FastAPI(title="Portfolio AI API", version="2.0.0")

    origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    app_instance.add_middleware(
        CORSMiddleware,
        allow_origins=[origin.strip() for origin in origins if origin.strip()],
        allow_credentials=True,
        allow_methods=["GET", "POST"],
        allow_headers=["*"],
    )

    @app_instance.on_event("startup")
    def startup() -> None:
        base_dir = Path(__file__).resolve().parents[1]
        content_path = Path(os.getenv("CONTENT_PATH", base_dir / "data" / "portfolio_content.json"))

        embed_model = os.getenv("EMBED_MODEL", "all-MiniLM-L6-v2")
        local_model_path = base_dir / "model_cache" / embed_model

        if local_model_path.exists():
            print(f"Loading embedding model from local cache: {local_model_path}")
            embedder = SentenceTransformer(str(local_model_path))
        else:
            print(f"Loading embedding model from Hugging Face hub: {embed_model}")
            embedder = SentenceTransformer(embed_model)

        docs, profile_summary = _load_content(content_path)
        embeddings = _embed_docs(embedder, docs)

        app_instance.state.embedder = embedder
        app_instance.state.docs = docs
        app_instance.state.doc_embeddings = embeddings
        app_instance.state.profile_summary = profile_summary

    @app_instance.get("/health")
    def health() -> dict:
        return {"status": "ok", "version": "2.0.0"}

    # -----------------------------------------------------------------------
    # /api/ask  — Portfolio Q&A with strict relevance gating
    # -----------------------------------------------------------------------
    @app_instance.post("/api/ask", response_model=AskResponse)
    def ask_portfolio(request: AskRequest) -> AskResponse:
        mock_llm = os.getenv("MOCK_LLM", "false").lower() == "true"
        api_key = os.getenv("GROQ_API_KEY")
        _ensure_llm_ready(api_key, mock_llm)

        embedder: SentenceTransformer = app_instance.state.embedder
        docs: List[ContentDoc] = app_instance.state.docs
        doc_embeddings: np.ndarray = app_instance.state.doc_embeddings
        profile_summary: Optional[str] = getattr(app_instance.state, "profile_summary", None)

        sources, out_of_scope = _retrieve(
            embedder, docs, doc_embeddings, request.question, top_k=5
        )

        # Gate: if nothing is relevant enough, skip LLM entirely
        if out_of_scope:
            return AskResponse(answer=_OUT_OF_SCOPE_RESPONSE, sources=[])

        source_docs = [doc for doc in docs if doc.title in {s.title for s in sources}]

        if mock_llm:
            answer = _mock_answer(request.question, source_docs)
        else:
            client = Groq(api_key=api_key)
            model = os.getenv("GROQ_MODEL", "gpt-oss-120b")
            answer = _groq_answer(client, model, request.question, source_docs, profile_summary)

        return AskResponse(answer=answer, sources=sources)

    # -----------------------------------------------------------------------
    # /api/job-match  — Honest LLM-grounded job fit analysis
    # -----------------------------------------------------------------------
    @app_instance.post("/api/job-match", response_model=JobMatchResponse)
    def job_match(request: JobMatchRequest) -> JobMatchResponse:
        mock_llm = os.getenv("MOCK_LLM", "false").lower() == "true"
        api_key = os.getenv("GROQ_API_KEY")
        _ensure_llm_ready(api_key, mock_llm)

        embedder: SentenceTransformer = app_instance.state.embedder
        docs: List[ContentDoc] = app_instance.state.docs
        doc_embeddings: np.ndarray = app_instance.state.doc_embeddings
        profile_summary: Optional[str] = getattr(app_instance.state, "profile_summary", None)

        # Retrieve potentially relevant context (no hard threshold here — we pass
        # everything to the LLM and let it decide what's genuinely relevant)
        top_projects = _retrieve_by_section(
            embedder, docs, doc_embeddings, request.job_description, "project", top_k=4
        )
        top_skills = _retrieve_by_section(
            embedder, docs, doc_embeddings, request.job_description, "skill", top_k=6
        )
        top_experience = _retrieve_by_section(
            embedder, docs, doc_embeddings, request.job_description, "experience", top_k=4
        )

        if mock_llm:
            return JobMatchResponse(
                score=50,
                summary="Mock summary for development.",
                highlights=["Mock highlight"],
                matched_projects=[doc.title for doc in top_projects[:2]],
                matched_skills=[doc.title for doc in top_skills[:2]],
            )

        client = Groq(api_key=api_key)
        model = os.getenv("GROQ_MODEL", "gpt-oss-120b")

        # LLM performs the honest, grounded analysis and returns structured JSON
        result = _groq_job_match(
            client=client,
            model=model,
            job_description=request.job_description,
            profile_summary=profile_summary or "",
            top_projects=top_projects,
            top_skills=top_skills,
            top_experience=top_experience,
        )

        # Build human-readable highlights from the LLM's result
        raw_highlights = result.get("highlights", [])
        matched_projects = result.get("matched_projects", [])
        matched_skills = result.get("matched_skills", [])

        # Ensure highlights are strings
        highlights = [str(h) for h in raw_highlights] if raw_highlights else []

        return JobMatchResponse(
            score=result["score"],
            summary=result.get("summary", ""),
            highlights=highlights,
            matched_projects=[str(p) for p in matched_projects],
            matched_skills=[str(s) for s in matched_skills],
        )

    return app_instance


app = create_app()
