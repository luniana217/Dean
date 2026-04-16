FROM node:20-slim AS builder

WORKDIR /app

COPY vite-project/package*.json ./
RUN npm install

COPY vite-project/ .

# ← .env 빌드 시점에 강제 주입
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80