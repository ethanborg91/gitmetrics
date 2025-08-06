from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from models import User

class UserRepo:
    async def create(self, session: AsyncSession, email: str, hashed_password: str):
        user = User(email=email, hashed_password=hashed_password)
        session.add(user)
        try:
            await session.commit()
            return user
        except IntegrityError:
            await session.rollback()
            raise HTTPException(status_code=400, detail="Email already exists")

    async def get_by_email(self, session: AsyncSession, email: str):
        result = await session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()