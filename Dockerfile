# Сборка Фронтенда
FROM node:22-alpine AS builder

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ ./

RUN npm run build

# Финальный образ
FROM node:22-alpine
WORKDIR /app
RUN npm install -g serve

COPY --from=builder /app/frontend/dist ./build

EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]