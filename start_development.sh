#!/bin/bash

echo "�� Starting NetVillage Payment System Development Environment..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js version: v20.19.0"

# Check if dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

echo ""
echo "🔧 Starting servers..."
echo "   Backend: http://localhost:5000"
echo "   Frontend: http://localhost:3000"
echo "   API Health: http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop all servers"

# Start backend
cd backend
npm run dev &
BACKEND_PID=0

# Wait for backend to start
sleep 5

# Start frontend
cd ../frontend
npm start &
FRONTEND_PID=0

# Function to cleanup processes
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill   2>/dev/null
    exit 0
}

# Set trap to cleanup on exit
trap cleanup INT TERM

# Wait for processes
wait
