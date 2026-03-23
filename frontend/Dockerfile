# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

# Enable corepack so pnpm is available
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Install dependencies (cached layer)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm run build

# ── Stage 2: serve ───────────────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
