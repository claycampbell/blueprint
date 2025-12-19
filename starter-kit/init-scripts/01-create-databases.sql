-- Create multiple databases for our services
-- This script runs automatically when PostgreSQL container starts

-- Create windmill database if it doesn't exist
CREATE DATABASE windmill;
GRANT ALL PRIVILEGES ON DATABASE windmill TO blueprint;

-- Ensure connect2 database exists (primary database)
-- It's already created by POSTGRES_DB env var, but we'll ensure permissions
GRANT ALL PRIVILEGES ON DATABASE connect2 TO blueprint;