# syntax=docker/dockerfile:1
# Build context: repository root.
FROM node:24-alpine AS build
WORKDIR /repo
COPY package.json package-lock.json ./
COPY packages/theme/package.json packages/theme/
COPY apps/landing/package.json apps/landing/
RUN npm ci --workspace @cactus-cove/landing --include-workspace-root
COPY packages/theme packages/theme
COPY apps/landing apps/landing
RUN npm run build -w @cactus-cove/landing

FROM nginx:1.29-alpine
COPY docker/landing/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/landing/dist /usr/share/nginx/html
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/healthz || exit 1
