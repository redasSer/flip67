#!/usr/bin/env bash
# deploy.sh - Deploy flip67 backend on a VPS
# Usage: ./deploy.sh

set -euo pipefail

echo "==> [1/5] Pulling latest changes..."
git pull origin main

echo "==> [2/5] Checking for .env file..."
if [ ! -f .env ]; then
  echo "ERROR: .env file not found. Copy .env.example to .env and fill in the values."
  echo "  cp .env.example .env && nano .env"
  exit 1
fi

echo "==> [3/5] Building Docker image..."
docker compose build --no-cache app

echo "==> [4/5] Restarting services..."
docker compose down --remove-orphans
docker compose up -d

echo "==> [5/5] Waiting for app to become healthy..."
RETRIES=20
until docker inspect --format='{{.State.Health.Status}}' flip67-app 2>/dev/null | grep -q "healthy"; do
  RETRIES=$((RETRIES - 1))
  if [ "$RETRIES" -le 0 ]; then
    echo "ERROR: App did not become healthy in time. Check logs: docker compose logs app"
    exit 1
  fi
  echo "    Waiting... ($RETRIES retries left)"
  sleep 10
done

echo ""
echo "✅ Deployment complete! App is running on port $(grep SERVER_PORT .env | cut -d= -f2 || echo 8080)."
echo "   View logs: docker compose logs -f app"

