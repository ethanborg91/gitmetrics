from fastapi import FastAPI
from routers import auth, events

app = FastAPI(title="GitMetrics API v0")

app.include_router(auth.router) 
app.include_router(events.router)