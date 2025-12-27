"""Application configuration using Pydantic Settings."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Application
    app_name: str = "Connect 2.0 API"
    app_version: str = "0.1.0"
    debug: bool = False
    environment: str = "development"

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/connect2"

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # AWS (LocalStack for development)
    aws_endpoint_url: str | None = None  # Set to http://localhost:4566 for LocalStack
    aws_region: str = "us-west-2"
    s3_bucket_documents: str = "connect2-documents-dev"

    # Security
    secret_key: str = "change-me-in-production"
    access_token_expire_minutes: int = 30


@lru_cache
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
