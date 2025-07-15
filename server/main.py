from fastapi import FastAPI, HTTPException
from jsonschema import validate, ValidationError
import json, pathlib, uuid
from sqlalchemy import text
from database import insert_raw_event, Session

app = FastAPI(title="GitMetrics API v0")
SCHEMA = json.loads(
    (pathlib.Path(__file__).parent / "schemas" / "event-v1.json").read_text()
)


# POST endpoint to import data from CLI
@app.post("/events")
async def ingest(event: dict):
    try:
        validate(event, SCHEMA)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"schema error: {e.message}")

    event_id = str(uuid.uuid4())
    await insert_raw_event(event, event_id)
    return {"status": "ok", "id": event_id}


# GET endpoint to retrieve DB data
@app.get("/summary")
async def get_summary():
    try:
        async with Session() as session:
            # Query 1: Total commits
            total_commits_results = await session.execute(
                text("SELECT COUNT (*) FROM raw_events")
            )
            total_commits = total_commits_results.scalar() or 0

            # Query 2: Repos tracked
            repos_result = await session.execute(
                text("SELECT COUNT(DISTINCT payload->>'repo_hash') FROM raw_events")
            )
            repos = repos_result.scalar() or 0

            # Query 3: Commits by day
            commits_by_day_result = await session.execute(
                text(
                    """SELECT DATE(payload->>'timestamp') AS date, COUNT(*) AS count
                    FROM raw_events
                    GROUP BY DATE(payload->>'timestamp')
                    ORDER BY date"""
                )
            )
            commits_by_day = [
                {"date": str(row[0]), "count": row[1]}
                for row in commits_by_day_result.fetchall()
            ]

            # Structured JSON response
            return {
                "total_commits": total_commits,
                "repos": repos,
                "commits_by_day": commits_by_day,
            }

    except Exception as e:
        raise HTTPException(status_code=500, details=f"Database error: {str(e)}")
