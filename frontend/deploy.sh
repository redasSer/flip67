#!/usr/bin/env bash
set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
IMAGE_NAME="flip67-frontend"
COMPOSE_FILE="docker-compose.yml"

echo "▶  Pulling latest code..."
git pull origin main

echo "▶  Building Docker image..."
docker compose -f "$COMPOSE_FILE" build --no-cache frontend

echo "▶  Restarting services..."
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

echo "▶  Cleaning up unused images..."
docker image prune -f

echo "✅  Deployment complete."
docker compose -f "$COMPOSE_FILE" ps
