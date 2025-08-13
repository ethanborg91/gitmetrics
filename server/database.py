from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from typing import AsyncGenerator
from sqlalchemy.sql import text
import os
import json

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_async_engine(DATABASE_URL, pool_pre_ping=True)
Session = async_sessionmaker(engine, expire_on_commit=False)


async def insert_raw_event(payload: dict, event_id: str , user_id: str):
    """Insert full JSONB payload."""
    async with Session() as session:
        await session.execute(
            text("INSERT INTO raw_events (id, payload, user_id) VALUES (:id, :pl, :user_id)"),
            {"id": event_id, "pl": json.dumps(payload), "user_id": user_id},
        )
        await session.commit()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    session = Session()
    try:
        yield session
    finally:
        await session.close()