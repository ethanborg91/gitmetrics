from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, events

app = FastAPI(title="GitMetrics API v0")

origins = [
    "http://localhost:3000",  
    "http://localhost",   # Need deployed url later
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,  # Required for cookies/credentials: 'include'
    allow_methods=["*"],     # Allow all (or specify ["GET", "POST", "OPTIONS"])
    allow_headers=["*"],     # Allow all (or ["Authorization", "Content-Type"])
)

app.include_router(auth.router) 
app.include_router(events.router)