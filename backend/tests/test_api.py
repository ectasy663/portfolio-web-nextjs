import os
from pathlib import Path

from fastapi.testclient import TestClient


def _build_client():
    os.environ["MOCK_LLM"] = "true"
    base_dir = Path(__file__).resolve().parents[1]
    os.environ["CONTENT_PATH"] = str(base_dir / "data" / "portfolio_content.json")

    from app.main import create_app

    return TestClient(create_app())


def test_health():
    client = _build_client()
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_ask_endpoint():
    client = _build_client()
    response = client.post("/api/ask", json={"question": "What are your AI strengths?"})
    assert response.status_code == 200
    payload = response.json()
    assert "answer" in payload
    assert "sources" in payload


def test_job_match_endpoint():
    client = _build_client()
    response = client.post(
        "/api/job-match",
        json={
            "job_description": "We need an AI engineer with LLM and RAG experience, "
            "Python skills, and full stack delivery in React and Next.js for production apps. "
            "Experience with agentic systems and web performance is a plus."
        },
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["score"] >= 0
    assert isinstance(payload["matched_projects"], list)
