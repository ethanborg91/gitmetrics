from fastapi import FastAPI, HTTPException
from jsonschema import validate, ValidationError
import json, pathlib, uuid

from database import insert_raw_event

app = FastAPI(title="GitMetrics API v0")
SCHEMA = json.loads(
    (pathlib.Path(__file__).parent / "schemas" / "event-v1.json").read_text()
)


@app.post("/events")
async def ingest(event: dict):
    try:
        validate(event, SCHEMA)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"schema error: {e.message}")

    event_id = str(uuid.uuid4())
    await insert_raw_event(event, event_id)

    return {"status": "ok", "id": event_id}
