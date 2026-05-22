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

# baked-in config (docker-compose mounts a live copy over this,
# so the image also works standalone with `docker run`)
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443

# Caddy's default entrypoint runs:
#   caddy run --config /etc/caddy/Caddyfile --adapter caddyfile
