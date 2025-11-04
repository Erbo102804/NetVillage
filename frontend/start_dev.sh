#!/bin/bash

echo "Starting NetVillage Payment System Development Environment..."

# Запуск бэкенда
echo "Starting Backend Server..."
cd backend
npm run dev &
BACKEND_PID=0

# Ожидание запуска бэкенда
sleep 5

# Запуск фронтенда
echo "Starting Frontend Development Server..."
cd ../frontend
npm start &
FRONTEND_PID=0

echo "Development servers are starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Ожидание сигнала завершения
wait  
