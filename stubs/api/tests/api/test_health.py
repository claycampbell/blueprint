"""Tests for health check endpoints."""

import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_liveness_probe_returns_ok(client: AsyncClient) -> None:
    """Test that the liveness probe returns status ok."""
    response = await client.get("/health/live")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"


@pytest.mark.anyio
async def test_health_check_returns_expected_fields(client: AsyncClient) -> None:
    """Test that the health check returns all expected fields."""
    response = await client.get("/health")

    assert response.status_code == 200
    data = response.json()

    # Verify all expected fields are present
    assert "status" in data
    assert "database" in data
    assert "redis" in data
    assert "timestamp" in data
    assert "version" in data


@pytest.mark.anyio
async def test_health_check_status_values(client: AsyncClient) -> None:
    """Test that health check status values are valid."""
    response = await client.get("/health")

    assert response.status_code == 200
    data = response.json()

    # Status should be either healthy or unhealthy
    assert data["status"] in ["healthy", "unhealthy"]

    # Database and Redis should be connected or disconnected
    assert data["database"] in ["connected", "disconnected"]
    assert data["redis"] in ["connected", "disconnected"]


@pytest.mark.anyio
async def test_health_check_version_format(client: AsyncClient) -> None:
    """Test that version follows semantic versioning format."""
    response = await client.get("/health")

    assert response.status_code == 200
    data = response.json()

    # Version should be in semver format (e.g., "0.1.0")
    version = data["version"]
    parts = version.split(".")
    assert len(parts) == 3, f"Version {version} should have 3 parts"
    assert all(part.isdigit() for part in parts), f"Version parts should be numeric"


@pytest.mark.anyio
async def test_health_check_timestamp_is_iso_format(client: AsyncClient) -> None:
    """Test that timestamp is in ISO 8601 format."""
    from datetime import datetime

    response = await client.get("/health")

    assert response.status_code == 200
    data = response.json()

    # Should be parseable as ISO format datetime
    timestamp = data["timestamp"]
    try:
        datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
    except ValueError:
        pytest.fail(f"Timestamp {timestamp} is not valid ISO 8601 format")
