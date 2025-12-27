"""Shared pytest fixtures for API tests."""

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
def anyio_backend() -> str:
    """Use asyncio as the async backend for tests."""
    return "asyncio"


@pytest.fixture
async def client() -> AsyncClient:
    """Create an async test client for the FastAPI app.

    Usage:
        async def test_something(client: AsyncClient):
            response = await client.get("/health")
            assert response.status_code == 200
    """
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac


# TODO: Add database fixtures when DB is configured
# @pytest.fixture
# async def db_session():
#     """Create a test database session."""
#     pass

# TODO: Add authenticated client fixture
# @pytest.fixture
# async def authenticated_client(client: AsyncClient):
#     """Create an authenticated test client."""
#     pass
