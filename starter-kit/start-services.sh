#!/bin/bash

# Connect 2.0 - Service Startup Script
# This script starts all services and provides instructions

echo "================================================"
echo "   Connect 2.0 with Windmill - Startup Script   "
echo "================================================"
echo ""

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo ""
    echo "Please start Docker Desktop and try again."
    echo ""
    echo "Windows: Start Docker Desktop from the Start Menu"
    echo "Mac: Start Docker Desktop from Applications"
    echo "Linux: sudo systemctl start docker"
    echo ""
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file"
else
    echo "✅ .env file exists"
fi

echo ""
echo "Starting services..."
echo ""

# Start services
docker-compose up -d

echo ""
echo "Waiting for services to be healthy..."
sleep 10

# Check service health
echo ""
echo "Service Status:"
echo "---------------"
docker-compose ps

echo ""
echo "================================================"
echo "   Services are starting up!                    "
echo "================================================"
echo ""
echo "🌐 Access Points:"
echo ""
echo "  Windmill UI:    http://localhost:8000"
echo "                  Login: admin@windmill.dev"
echo "                  Pass:  changeme"
echo ""
echo "  API Server:     http://localhost:3000"
echo "                  (Start with: cd api && npm run dev)"
echo ""
echo "  PostgreSQL:     localhost:5432"
echo "                  User: blueprint"
echo "                  Pass: blueprint_dev_2024"
echo ""
echo "================================================"
echo ""
echo "📚 Next Steps:"
echo ""
echo "1. Wait ~30 seconds for all services to initialize"
echo ""
echo "2. Open Windmill UI at http://localhost:8000"
echo "   - Login with admin@windmill.dev / changeme"
echo "   - IMPORTANT: Change the admin password!"
echo ""
echo "3. Import sample workflows:"
echo "   - Click 'Scripts' → 'New Script'"
echo "   - Choose TypeScript"
echo "   - Copy code from windmill-workflows/lead_intake.ts"
echo "   - Save and test"
echo ""
echo "4. Start the API server:"
echo "   cd api"
echo "   npm run dev"
echo ""
echo "5. Test the integration:"
echo "   See README.md for curl commands"
echo ""
echo "================================================"
echo ""
echo "To view logs:    docker-compose logs -f [service]"
echo "To stop:         docker-compose down"
echo "To reset:        docker-compose down -v"
echo ""