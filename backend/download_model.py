import os
from pathlib import Path
from sentence_transformers import SentenceTransformer


def download_and_cache_model():
    embed_model = os.getenv("EMBED_MODEL", "all-MiniLM-L6-v2")
    print(f"--- [Build Step] Starting model download for: {embed_model} ---")

    # Locate the target directory inside the backend folder
    base_dir = Path(__file__).resolve().parent
    cache_dir = base_dir / "model_cache" / embed_model

    print(f"--- Saving model to local cache at: {cache_dir} ---")

    # Download model from HF Hub
    model = SentenceTransformer(embed_model)

    # Save to local folder
    model.save(str(cache_dir))
    print(f"--- Model saved successfully to cache! ---")


if __name__ == "__main__":
    download_and_cache_model()
