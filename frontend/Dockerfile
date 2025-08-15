# syntax=docker/dockerfile:1.7

FROM node:20-slim AS build
WORKDIR /app
COPY package.json tsconfig.json vite.config.ts index.html /app/
COPY src /app/src
RUN --mount=type=cache,target=/root/.cache \
		npm install --no-audit --no-fund && npm run build

FROM nginx:1.27-alpine AS runtime
WORKDIR /usr/share/nginx/html

# Copy build artifacts
COPY --from=build /app/dist/ ./

# Nginx template and entrypoint to inject BACKEND_URL at runtime
COPY frontend/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY frontend/docker-entrypoint.sh /docker-entrypoint.d/99-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/99-runtime-config.sh

EXPOSE 8080
ENV PORT=8080

# Nginx will listen on $PORT
CMD ["/docker-entrypoint.sh", "nginx", "-g", "daemon off;"]


