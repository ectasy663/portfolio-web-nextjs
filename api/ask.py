import os
import json
import pathlib
from http.server import BaseHTTPRequestHandler
from groq import Groq

def load_portfolio_data():
    base_dir = pathlib.Path(__file__).resolve().parent.parent
    data_path = base_dir / "backend" / "data" / "portfolio_content.json"
    
    try:
        with open(data_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        return {"profile_summary": "Error loading data.", "documents": []}

_OUT_OF_SCOPE_RESPONSE = (
    "That topic doesn't appear to be covered in Naman's portfolio data. "
    "I can only answer questions about his documented work experience, skills, projects, education, and achievements. "
    "Feel free to ask me anything about his AI engineering work, full-stack development projects, or professional background!"
)

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            body = json.loads(post_data.decode('utf-8'))
            question = body.get('question', '').strip()

            if not question:
                self.send_error_response(400, "Question is required")
                return

            api_key = os.environ.get("GROQ_API_KEY")
            if not api_key:
                self.send_error_response(503, "Missing GROQ_API_KEY")
                return

            portfolio_data = load_portfolio_data()
            profile_summary = portfolio_data.get("profile_summary", "")
            documents = portfolio_data.get("documents", [])

            # Format the context
            context_blocks = []
            for doc in documents:
                title = doc.get("title", "")
                section = doc.get("section", "")
                text = doc.get("text", "")
                context_blocks.append(f"[{section.upper()}] {title}\n{text}")
            
            context_str = "\n\n".join(context_blocks)

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
                "=== PORTFOLIO CONTEXT ===\n"
                f"{context_str}"
            )

            client = Groq(api_key=api_key)
            model = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")
            
            completion = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.1,
                max_tokens=600,
            )

            answer = completion.choices[0].message.content.strip()

            # For sources, since we bypass RAG, we will provide a few relevant documents as sources.
            question_lower = question.lower()
            matched_sources = []
            for doc in documents:
                text_lower = doc.get("text", "").lower()
                title_lower = doc.get("title", "").lower()
                if any(word in text_lower or word in title_lower for word in question_lower.split() if len(word) > 4):
                    snippet = doc.get("text", "")[:280].rstrip()
                    matched_sources.append({
                        "title": doc.get("title", ""),
                        "section": doc.get("section", ""),
                        "snippet": snippet,
                        "score": 1.0
                    })
            
            if not matched_sources and documents:
                for doc in documents[:2]:
                    snippet = doc.get("text", "")[:280].rstrip()
                    matched_sources.append({
                        "title": doc.get("title", ""),
                        "section": doc.get("section", ""),
                        "snippet": snippet,
                        "score": 1.0
                    })

            matched_sources = matched_sources[:5]

            response_data = {
                "answer": answer,
                "sources": matched_sources
            }

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode('utf-8'))

        except Exception as e:
            self.send_error_response(500, str(e))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def send_error_response(self, status_code, message):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({"error": message}).encode('utf-8'))
