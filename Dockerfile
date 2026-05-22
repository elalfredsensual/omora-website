# ─── Stage 1: build the static site ───────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# install dependencies (cached unless package files change)
COPY package.json package-lock.json ./
RUN npm ci

# build the site into /app/dist
COPY . .
RUN npm run build

# ─── Stage 2: serve with Caddy (static files + automatic HTTPS) ──
FROM caddy:2-alpine

# the built site
COPY --from=build /app/dist /srv

# Caddy config (static file server on port 80)
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80

# Caddy's default entrypoint runs:
#   caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
