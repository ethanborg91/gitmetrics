FROM python:3.12-alpine3.22
WORKDIR /app
COPY server/requirements.txt .  
RUN pip install --no-cache-dir -r requirements.txt
COPY server/ .                  
COPY schemas/ ./schemas        
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]