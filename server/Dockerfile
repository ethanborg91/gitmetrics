# server/Dockerfile

# 1) Base Python image
FROM python:3.12-slim

# 2) Install build tools
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

# 3) Work inside /app
WORKDIR /app

# 4) Copy & install Python deps
#    (context is the repo root, so this picks up server/requirements.txt)
COPY server/requirements.txt .  
RUN pip install --no-cache-dir -r requirements.txt

# 5) Copy your app code into /app
COPY server/ .                  

# 6) Copy the JSON schema into /app/schemas
COPY schemas/ ./schemas        

# 7) Default command
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
