@echo off
setlocal

echo ================================================
echo Windmill Reset Script - Community Edition Setup
echo ================================================
echo.

REM Stop Windmill services
echo 1. Stopping Windmill services...
docker-compose stop windmill-server windmill-worker windmill-lsp caddy

REM Clear Windmill database (preserving connect2 database)
echo.
echo 2. Clearing Windmill database...
docker-compose exec -T postgres psql -U blueprint -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'windmill' AND pid ^<^> pg_backend_pid();"
docker-compose exec -T postgres psql -U blueprint -d postgres -c "DROP DATABASE IF EXISTS windmill;"
docker-compose exec -T postgres psql -U blueprint -d postgres -c "CREATE DATABASE windmill WITH OWNER blueprint;"

REM Remove Windmill volumes to clear cached data
echo.
echo 3. Clearing Windmill cached data...
docker-compose down
docker volume rm starter-kit_windmill_worker_data 2>nul
docker volume rm starter-kit_windmill_lsp_cache 2>nul

REM Start services fresh
echo.
echo 4. Starting services with fresh configuration...
docker-compose up -d postgres
timeout /t 5 /nobreak >nul

docker-compose up -d windmill-server windmill-worker windmill-lsp caddy

echo.
echo 5. Waiting for Windmill to initialize...
timeout /t 10 /nobreak >nul

REM Check service status
echo.
echo 6. Service Status:
docker-compose ps

echo.
echo ================================================
echo Reset Complete!
echo ================================================
echo.
echo Windmill has been reset to Community Edition defaults.
echo.
echo Access Windmill at: http://localhost:8000
echo Default login: admin@windmill.dev / changeme
echo.
echo IMPORTANT: Change the admin password after first login!
echo.
echo The Community Edition has no expiration and includes:
echo - Unlimited workflows and scripts
echo - All core automation features
echo - PostgreSQL backend
echo - Docker-based workers
echo.
echo Note: Some enterprise features may show as locked,
echo but all core functionality is available indefinitely.
echo ================================================

endlocal
pause