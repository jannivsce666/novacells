# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-slim AS base

WORKDIR /app
ENV NODE_ENV=production

# Install build deps
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

# Copy package manifests and install
COPY package*.json ./
RUN npm ci --include=dev

# Copy source and build client
COPY . .
RUN npm run build && npm prune --omit=dev


# Runtime image
FROM node:${NODE_VERSION}-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=8080

# Copy app from builder
COPY --from=base /app /app

EXPOSE 8080
CMD ["node", "server.js"]
