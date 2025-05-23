from fastapi import FastAPI, HTTPException
from jsonschema import validate, ValidationError
import json, pathlib, uuid

app = FastAPI(title="GitMetrics API v0")

SCHEMA = json.loads(
    (pathlib.Path(__file__).parents[1] / "schemas/event-v1.json").read_text()
)


@app.post("/events")
async def ingest(event: dict):
    try:
        validate(event, SCHEMA)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=f"schema error: {e.message}")
    # TODO: insert into Postgres later
    return {"status": "ok", "id": str(uuid.uuid4())}
