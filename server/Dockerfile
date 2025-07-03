# ──────────────────────────────────────────────────────────────
#  Dockerfile   (save as server/Dockerfile)
#  Build with:  docker compose build api
# ──────────────────────────────────────────────────────────────

# 1) Base image — Python 3.12 on slim Debian
FROM python:3.12-slim AS base

# 2) System-level packages you need for pip wheels that compile
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

# 3) Everything below happens inside /app
WORKDIR /app

# 4) Copy only requirements first for Docker layer-cache efficiency
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# 5) Copy the FastAPI application *after* deps are installed
#    (use the path relative to the build context root)
COPY . .

# 6) Default command — starts Uvicorn when the container runs
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
