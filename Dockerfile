# ─── Stage 1: build the SSR site ──────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ─── Stage 2: lean Node runtime ───────────────────────────────
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=80
# Persisted under a Docker volume — admin edits survive redeploys.
ENV DATA_DIR=/data

# Production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Built server + client assets
COPY --from=build /app/dist ./dist

EXPOSE 80

# ADMIN_PASSWORD and SESSION_SECRET must come from docker-compose env
CMD ["node", "./dist/server/entry.mjs"]
