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


def _groq_answer(client: Groq, model: str, question: str, sources: List[ContentDoc], profile_summary: Optional[str] = None) -> str:
    context = "\n\n".join(
        [
            f"[{doc.section}] {doc.title}\n{doc.text}"
            for doc in sources
        ]
    )

    system_prompt = (
        "You are Naman Singh Panwar's AI Portfolio Assistant, an expert AI agent designed to answer questions strictly about Naman's work, experience, education, skills, and background.\n\n"
    )
    if profile_summary:
        system_prompt += (
            "Here is Naman's global profile summary for quick reference:\n"
            f"{profile_summary}\n\n"
        )
    system_prompt += (
        "Strict Guidelines:\n"
        "- Answer accurately, truthfully, and professionally, relying ONLY on the provided context and global profile summary.\n"
        "- Never hallucinate, extrapolate, or invent details about Naman's life, career, projects, or skills.\n"
        "- If a user asks about months or years of work experience, use the detailed timeline in the global profile to calculate and state it accurately (e.g., GyanNetra AI Engineer is current from May 2026, AI R&D is 8 months, DRDO is 2 months, Gyannetra Pvt Ltd is 2 months, Microsoft is 1 month, Ideaforage is 6 months, totaling ~20 months or 1.6+ years).\n"
        "- Ground tech and job-related answers strictly in Naman's actual work. If a user asks a general technology question or requests code that is unrelated to Naman's specific projects, briefly explain that you are Naman's assistant, highlight how Naman has used or worked with that tech in his real experience (e.g. Next.js, React, LangChain, Python), and decline to answer general technical topics or write random code outside his real portfolio scope.\n"
        "- Do not make up facts or technical proficiencies. If the requested information is not explicitly in the context or profile summary, politely and clearly state that you do not have that information."
    )

    user_prompt = (
        "Question:\n"
        f"{question}\n\n"
        "Retrieved Context Chunks:\n"
        f"{context}"
    )

    completion = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
        max_tokens=500,
    )

    return completion.choices[0].message.content.strip()


def _mock_answer(question: str, sources: List[ContentDoc]) -> str:
    titles = ", ".join([doc.title for doc in sources])
    return (
        "Mock response for development. "
        f"Question: {question}. "
        f"Sources: {titles}."
    )


def _retrieve(
    embedder: SentenceTransformer,
    docs: List[ContentDoc],
    doc_embeddings: np.ndarray,
    query: str,
    top_k: int,
) -> List[Source]:
    query_vec = embedder.encode([query], normalize_embeddings=True)[0]
    scores = doc_embeddings @ query_vec
    top_indices = np.argsort(scores)[::-1][:top_k]

    sources = []
    for index in top_indices:
        doc = docs[int(index)]
        snippet = doc.text[:260].rstrip()
        sources.append(
            Source(
                title=doc.title,
                section=doc.section,
                snippet=snippet,
                score=float(scores[int(index)]),
            )
        )

    return sources


def _match_by_section(
    embedder: SentenceTransformer,
    docs: List[ContentDoc],
    doc_embeddings: np.ndarray,
    query: str,
    section: str,
    top_k: int,
) -> List[ContentDoc]:
    query_vec = embedder.encode([query], normalize_embeddings=True)[0]
    scores = doc_embeddings @ query_vec

    filtered = [
        (doc, float(scores[i]))
        for i, doc in enumerate(docs)
        if doc.section == section
    ]

    ranked = sorted(filtered, key=lambda item: item[1], reverse=True)
    return [doc for doc, _ in ranked[:top_k]]


def _score_match(
    embedder: SentenceTransformer,
    docs: List[ContentDoc],
    doc_embeddings: np.ndarray,
    query: str,
) -> int:
    query_vec = embedder.encode([query], normalize_embeddings=True)[0]
    scores = doc_embeddings @ query_vec
    top_scores = sorted(scores, reverse=True)[:5]
    if not top_scores:
        return 0
    average = float(np.mean(top_scores))
    return int(round(max(0.0, min(1.0, average)) * 100))


def create_app() -> FastAPI:
    app_instance = FastAPI(title="Portfolio AI API", version="1.0.0")

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
        return {"status": "ok"}

    @app_instance.post("/api/ask", response_model=AskResponse)
    def ask_portfolio(request: AskRequest) -> AskResponse:
        mock_llm = os.getenv("MOCK_LLM", "false").lower() == "true"
        api_key = os.getenv("GROQ_API_KEY")
        _ensure_llm_ready(api_key, mock_llm)

        embedder: SentenceTransformer = app_instance.state.embedder
        docs: List[ContentDoc] = app_instance.state.docs
        doc_embeddings: np.ndarray = app_instance.state.doc_embeddings
        profile_summary: Optional[str] = getattr(app_instance.state, "profile_summary", None)
        
        sources = _retrieve(embedder, docs, doc_embeddings, request.question, top_k=4)
        source_docs = [doc for doc in docs if doc.title in {s.title for s in sources}]

        if mock_llm:
            answer = _mock_answer(request.question, source_docs)
        else:
            client = Groq(api_key=api_key)
            model = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")
            answer = _groq_answer(client, model, request.question, source_docs, profile_summary)

        return AskResponse(answer=answer, sources=sources)

    @app_instance.post("/api/job-match", response_model=JobMatchResponse)
    def job_match(request: JobMatchRequest) -> JobMatchResponse:
        mock_llm = os.getenv("MOCK_LLM", "false").lower() == "true"
        api_key = os.getenv("GROQ_API_KEY")
        _ensure_llm_ready(api_key, mock_llm)

        embedder: SentenceTransformer = app_instance.state.embedder
        docs: List[ContentDoc] = app_instance.state.docs
        doc_embeddings: np.ndarray = app_instance.state.doc_embeddings

        score = _score_match(embedder, docs, doc_embeddings, request.job_description)
        top_projects = _match_by_section(embedder, docs, doc_embeddings, request.job_description, "project", 3)
        top_skills = _match_by_section(embedder, docs, doc_embeddings, request.job_description, "skill", 5)
        top_experience = _match_by_section(embedder, docs, doc_embeddings, request.job_description, "experience", 2)

        highlight_titles = [doc.title for doc in top_projects]
        skill_names = [doc.title for doc in top_skills]

        summary = ""
        if mock_llm:
            summary = "Mock summary for development."
        else:
            client = Groq(api_key=api_key)
            model = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")
            system_prompt = (
                "You are a recruiter assistant. Summarize the candidate fit in 3-4 sentences, "
                "and include a concise value proposition."
            )
            user_prompt = (
                "Job description:\n"
                f"{request.job_description}\n\n"
                "Relevant projects:\n"
                f"{', '.join(highlight_titles)}\n\n"
                "Relevant skills:\n"
                f"{', '.join(skill_names)}\n\n"
                "Relevant experience:\n"
                f"{', '.join([doc.title for doc in top_experience])}"
            )
            completion = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.2,
                max_tokens=300,
            )
            summary = completion.choices[0].message.content.strip()

        highlights = [
            f"Strong alignment with {title}." for title in highlight_titles
        ]

        return JobMatchResponse(
            score=score,
            summary=summary,
            highlights=highlights,
            matched_projects=highlight_titles,
            matched_skills=skill_names,
        )

    return app_instance


app = create_app()
