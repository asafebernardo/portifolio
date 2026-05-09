# Multi-stage: build Vite app → serve static assets with nginx (React Router SPA fallback).

FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Bake-time env for Vite (set build args in your host CI/CD — never commit secrets).
ARG VITE_ADMIN_USERNAME=
ARG VITE_ADMIN_PASSWORD=
ARG VITE_TRANSLATION_EMAIL=
ENV VITE_ADMIN_USERNAME=$VITE_ADMIN_USERNAME \
    VITE_ADMIN_PASSWORD=$VITE_ADMIN_PASSWORD \
    VITE_TRANSLATION_EMAIL=$VITE_TRANSLATION_EMAIL

RUN npm run build

FROM nginx:1.27-alpine
RUN apk add --no-cache wget
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
