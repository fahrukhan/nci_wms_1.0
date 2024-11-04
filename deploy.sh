#!/bin/bash

# Pull latest code
git pull origin main

# Load environment variables
set -a
source .env
set +a

# Build and start all services
docker-compose up --build -d

# Wait for the database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Run migrations
docker-compose exec app npm run db:migrate

# Remove old images
docker image prune -f

echo "Deployment completed"