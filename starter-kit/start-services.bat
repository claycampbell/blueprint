@echo off
REM Connect 2.0 - Service Startup Script for Windows
REM This script starts all services and provides instructions

echo ================================================
echo    Connect 2.0 with Windmill - Startup Script
echo ================================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running!
    echo.
    echo Please start Docker Desktop and try again.
    echo.
    echo Start Docker Desktop from the Start Menu or System Tray
    echo.
    pause
    exit /b 1
)

echo ✅ Docker is running
echo.

REM Check if .env exists
if not exist .env (
    echo Creating .env from .env.example...
    copy .env.example .env >nul
    echo ✅ Created .env file
) else (
    echo ✅ .env file exists
)

echo.
echo Starting services...
echo.

REM Start services
docker-compose up -d

echo.
echo Waiting for services to be healthy...
timeout /t 10 /nobreak >nul

REM Check service health
echo.
echo Service Status:
echo ---------------
docker-compose ps

echo.
echo ================================================
echo    Services are starting up!
echo ================================================
echo.
echo 🌐 Access Points:
echo.
echo   Windmill UI:    http://localhost:8000
echo                   Login: admin@windmill.dev
echo                   Pass:  changeme
echo.
echo   API Server:     http://localhost:3000
echo                   (Start with: cd api ^&^& npm run dev)
echo.
echo   PostgreSQL:     localhost:5432
echo                   User: blueprint
echo                   Pass: blueprint_dev_2024
echo.
echo ================================================
echo.
echo 📚 Next Steps:
echo.
echo 1. Wait ~30 seconds for all services to initialize
echo.
echo 2. Open Windmill UI at http://localhost:8000
echo    - Login with admin@windmill.dev / changeme
echo    - IMPORTANT: Change the admin password!
echo.
echo 3. Import sample workflows:
echo    - Click 'Scripts' → 'New Script'
echo    - Choose TypeScript
echo    - Copy code from windmill-workflows\lead_intake.ts
echo    - Save and test
echo.
echo 4. Start the API server:
echo    cd api
echo    npm run dev
echo.
echo 5. Test the integration:
echo    See README.md for curl commands
echo.
echo ================================================
echo.
echo To view logs:    docker-compose logs -f [service]
echo To stop:         docker-compose down
echo To reset:        docker-compose down -v
echo.
pause