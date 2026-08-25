import os
import json
import pathlib
import re
from http.server import BaseHTTPRequestHandler
from groq import Groq


def load_portfolio_data():
    base_dir = pathlib.Path(__file__).resolve().parent.parent
    data_path = base_dir / "backend" / "data" / "portfolio_content.json"
    try:
        with open(data_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"profile_summary": "Error loading data.", "documents": []}


def tokenize(text: str) -> set:
    """Lowercase, strip punctuation, return set of tokens longer than 2 chars."""
    return {w for w in re.sub(r"[^a-z0-9\s]", " ", text.lower()).split() if len(w) > 2}


def score_doc(doc: dict, question_tokens: set) -> float:
    """
    Score a document for relevance to the question.
    - Title matches score highest (3x weight)
    - Tag matches score medium (2x weight)
    - Body text matches score baseline (1x weight)
    """
    title_tokens = tokenize(doc.get("title", ""))
    body_tokens = tokenize(doc.get("text", ""))
    tag_tokens = set(doc.get("tags", []))

    title_overlap = len(question_tokens & title_tokens) * 3
    tag_overlap = len(question_tokens & tag_tokens) * 2
    body_overlap = len(question_tokens & body_tokens) * 1

    return float(title_overlap + tag_overlap + body_overlap)


def get_relevant_context(documents: list, question: str, top_k: int = 8) -> tuple[list, list]:
    """
    Score all docs against the question and return top-k most relevant,
    always including the profile_summary (handled separately).
    Returns (ranked_docs, source_docs_for_display).
    """
    q_tokens = tokenize(question)
    scored = [(doc, score_doc(doc, q_tokens)) for doc in documents]
    scored.sort(key=lambda x: x[1], reverse=True)

    # Always include the out-of-scope doc to prevent hallucination
    oos_docs = [d for d in documents if d.get("id") == "skill-out-of-scope"]
    top_docs = [d for d, _ in scored[:top_k] if d.get("id") != "skill-out-of-scope"]

    final_docs = top_docs + oos_docs
    # Source snippets for display — top 5 with a score > 0
    source_docs = [(d, s) for d, s in scored if s > 0][:5]

    return final_docs, source_docs


SYSTEM_PROMPT_BASE = """\
You are Naman Singh Panwar's AI Portfolio Assistant. Your ONLY job is to answer questions \
strictly and truthfully about Naman's documented work experience, skills, projects, and achievements.

=== STRICT RULES — VIOLATION IS NOT ALLOWED ===
1. ONLY use information present in the VERIFIED PROFILE and CONTEXT CHUNKS below. Do NOT invent, guess, or use general world knowledge.
2. If a skill or domain appears in the "Skills Outside Documented Experience" section, you MUST say Naman does NOT have experience in it.
3. EXPERIENCE CALCULATION (follow precisely):
   - AI/ML-specific: GyanNetra AI Engineer (current) + DRDO 2 months + Microsoft 1 month + Ideaforage 6 months = ~9+ months AI-focused.
   - Web/Frontend-specific: GyanNetra AI R&D Division 8 months + Gyannetra Web Dev Intern 2 months = ~10 months.
   - TOTAL across all roles: ~20 months. NEVER report total when asked about a specific domain.
4. His most recent and most impressive PROJECT is the Enterprise LMS & CRM System (druterus.com) — 525+ active users, Dockerized PostgreSQL workers, Python migration pipeline, zero-touch PDF invoicing.
5. If information is not in the provided context, say "I don't have that specific information in Naman's portfolio data."
6. Be precise, honest, professional. Do not over-claim or invent achievements.
7. Keep answers focused: 3-7 sentences unless a list is genuinely needed.
8. When asked about his portfolio website or AI assistant, mention the RAG-grounded AI system and serverless Groq API integration as technical features — this is a genuine technical achievement.
"""


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            body = json.loads(post_data.decode("utf-8"))
            question = body.get("question", "").strip()

            if not question:
                self.send_error_response(400, "Question is required")
                return

            api_key = os.environ.get("GROQ_API_KEY")
            if not api_key:
                self.send_error_response(503, "AI service not configured")
                return

            portfolio_data = load_portfolio_data()
            profile_summary = portfolio_data.get("profile_summary", "")
            documents = portfolio_data.get("documents", [])

            # Relevance-ranked context retrieval
            relevant_docs, source_docs = get_relevant_context(documents, question, top_k=8)

            context_blocks = []
            for doc in relevant_docs:
                section = doc.get("section", "").upper()
                title = doc.get("title", "")
                text = doc.get("text", "")
                context_blocks.append(f"[{section}] {title}\n{text}")

            context_str = "\n\n---\n\n".join(context_blocks)

            system_prompt = SYSTEM_PROMPT_BASE
            if profile_summary:
                system_prompt += (
                    "\n\n=== NAMAN'S VERIFIED PROFILE (Ground Truth — highest priority) ===\n"
                    f"{profile_summary}"
                )

            user_prompt = (
                f"Question: {question}\n\n"
                "=== RELEVANT PORTFOLIO CONTEXT ===\n"
                f"{context_str}"
            )

            client = Groq(api_key=api_key)
            model = os.environ.get("GROQ_MODEL", "openai/gpt-oss-120b")

            completion = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.1,
                max_tokens=650,
            )

            answer = completion.choices[0].message.content.strip()

            # Build source snippets for UI display
            matched_sources = []
            for doc, score in source_docs:
                snippet = doc.get("text", "")[:300].rstrip()
                matched_sources.append({
                    "title": doc.get("title", ""),
                    "section": doc.get("section", ""),
                    "snippet": snippet,
                    "score": round(score, 2),
                })

            response_data = {"answer": answer, "sources": matched_sources}

            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode("utf-8"))

        except Exception as e:
            self.send_error_response(500, str(e))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def send_error_response(self, status_code, message):
        self.send_response(status_code)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"error": message}).encode("utf-8"))
