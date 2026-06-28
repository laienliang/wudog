# ---- 构建阶段 ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
# 显式安装 devDependencies（含 @midwayjs/cli，提供 midway-bin）
RUN npm ci --include=dev
COPY . .
RUN npm run build

# ---- 运行阶段 ----
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
# 运行阶段只安装生产依赖
RUN npm ci --omit=dev
EXPOSE 3000
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379
CMD ["node", "dist/bootstrap.js"]
