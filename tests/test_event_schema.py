import json, uuid, hashlib, datetime, pathlib
from jsonschema import validate, Draft7Validator, ValidationError
import pytest

ROOT = pathlib.Path(__file__).parents[1]
SCHEMA = json.loads((ROOT / "schemas/event-v1.json").read_text())

def sample():
    return {
        "version": 1,
        "client_id": str(uuid.uuid4()),
        "repo_hash": hashlib.sha256(b"https://github.com/ethanborg91/commitmood").hexdigest(),
        "commit_sha": "abc1234",
        "timestamp": datetime.datetime.utcnow().isoformat(timespec="seconds") + "Z",
        "tz_offset_min": -240
    }

def test_schema_self_valid():
    Draft7Validator.check_schema(SCHEMA)

def test_good_event_passes():
    validate(sample(), SCHEMA)

def test_missing_required_field_fails():
    bad = sample()
    bad.pop("client_id")
    with pytest.raises(ValidationError):
        validate(bad, SCHEMA)
