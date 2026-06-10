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

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            body = json.loads(post_data.decode('utf-8'))
            job_description = body.get('job_description', '').strip()

            if not job_description:
                self.send_error_response(400, "Job description is required")
                return

            api_key = os.environ.get("GROQ_API_KEY")
            if not api_key:
                self.send_error_response(503, "Missing GROQ_API_KEY")
                return

            portfolio_data = load_portfolio_data()
            profile_summary = portfolio_data.get("profile_summary", "")
            documents = portfolio_data.get("documents", [])

            projects = [d for d in documents if d.get("section") == "project"]
            skills = [d for d in documents if d.get("section") == "skill"]
            experience = [d for d in documents if d.get("section") == "experience"]

            project_context = "\n".join([f"- {doc.get('title')}: {doc.get('text')}" for doc in projects])
            skill_context = "\n".join([f"- {doc.get('title')}: {doc.get('text')}" for doc in skills])
            experience_context = "\n".join([f"- {doc.get('title')}: {doc.get('text')}" for doc in experience])

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
                "=== CANDIDATE'S PROJECTS ===\n"
                f"{project_context if project_context else 'None retrieved.'}\n\n"
                "=== CANDIDATE'S SKILLS ===\n"
                f"{skill_context if skill_context else 'None retrieved.'}\n\n"
                "=== CANDIDATE'S EXPERIENCE ===\n"
                f"{experience_context if experience_context else 'None retrieved.'}\n\n"
                "Now perform the honest match analysis and return ONLY the JSON object."
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
                max_tokens=700,
            )

            raw = completion.choices[0].message.content.strip()

            if raw.startswith("```"):
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
            raw = raw.strip()

            try:
                result = json.loads(raw)
            except json.JSONDecodeError:
                result = {
                    "score": 0,
                    "summary": "Unable to parse the AI analysis. Please try again.",
                    "highlights": [],
                    "matched_projects": [],
                    "matched_skills": [],
                }

            result["score"] = max(0, min(100, int(result.get("score", 0))))

            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))

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
