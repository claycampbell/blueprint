"""Shared FastAPI dependencies."""

from typing import Annotated

from fastapi import Depends

from app.config import Settings, get_settings

# Dependency injection for settings
SettingsDep = Annotated[Settings, Depends(get_settings)]

# TODO: Add database session dependency
# async def get_db() -> AsyncGenerator[AsyncSession, None]: ...
# DbSessionDep = Annotated[AsyncSession, Depends(get_db)]

# TODO: Add current user dependency
# async def get_current_user() -> User: ...
# CurrentUserDep = Annotated[User, Depends(get_current_user)]

# TODO: Add Redis dependency
# async def get_redis() -> Redis: ...
# RedisDep = Annotated[Redis, Depends(get_redis)]
