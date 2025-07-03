from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.sql import text
import os
import json

# DATABASE_URL = os.getenv(
#     "DATABASE_URL",
#     "postgresql+asyncpg://gm:gm@localhost:5432/gitmetrics",
# )
DATABASE_URL = "postgresql+asyncpg://gm:gm@localhost:5432/gitmetrics"

engine = create_async_engine(DATABASE_URL, pool_pre_ping=True)
Session = async_sessionmaker(engine, expire_on_commit=False)


async def insert_raw_event(payload: dict, event_id: str):
    """Insert full JSONB payload."""
    async with Session() as session:
        await session.execute(
            text("INSERT INTO raw_events (id, payload) VALUES (:id, :pl)"),
            {"id": event_id, "pl": json.dumps(payload)},
        )
        await session.commit()
