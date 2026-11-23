# syntax=docker/dockerfile:1
# Build context: repository root.
FROM node:24-alpine AS deps
WORKDIR /repo
COPY package.json package-lock.json ./
COPY packages/theme/package.json packages/theme/
COPY apps/portal/package.json apps/portal/.npmrc apps/portal/
RUN npm ci --workspace @cactus-cove/portal --include-workspace-root

FROM deps AS build
COPY packages/theme packages/theme
COPY apps/portal apps/portal
RUN npm run build -w @cactus-cove/portal

FROM node:24-alpine
ENV NODE_ENV=production PORT=3000 HOST=0.0.0.0
WORKDIR /app
COPY --from=build /repo/apps/portal/build ./build
COPY --from=build /repo/apps/portal/package.json ./
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1
CMD ["node", "build"]
