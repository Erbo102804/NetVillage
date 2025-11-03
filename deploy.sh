#!/bin/bash
set -e

echo "🚀 Deploying NetVillage..."

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Build and start containers
echo "🐳 Building Docker containers..."
docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 10

# Run migrations
echo "📊 Running database migrations..."
docker-compose exec -T web python manage.py migrate

# Collect static files
echo "📁 Collecting static files..."
docker-compose exec -T web python manage.py collectstatic --noinput

# Load initial data (if needed)
echo "📋 Loading initial data..."
docker-compose exec -T web python manage.py loaddata tariffs/fixtures/initial_tariffs.json || true

echo "✅ Deployment complete!"
echo "🌐 Application is running at http://localhost"
