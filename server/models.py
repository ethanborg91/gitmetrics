from sqlalchemy import Column, String, ForeignKey, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import DeclarativeBase
import uuid

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = 'users'
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

class RawEvent(Base):
    __tablename__ = "raw_events"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)  # Similar fix if needed—align with schema.
    payload = Column(JSONB, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))