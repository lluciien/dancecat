#!/bin/bash

# 一键部署脚本 - dancecat项目部署到Docker容器
# 使用方法: bash deploy-dancecat.sh

set -eo pipefail

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "错误：Docker未安装，请先安装Docker"
    exit 1
fi

# 检查Docker Compose是否安装
if ! command -v docker-compose &> /dev/null; then
    echo "错误：Docker Compose未安装，请先安装Docker Compose"
    exit 1
fi

# 项目配置
REPO_URL="https://github.com/lluciien/dancecat.git"
PROJECT_DIR="./dancecat"
PORT=4666  # 修改为4666端口

# 清理旧项目
echo "[1/5] 清理旧部署..."
if [ -d "$PROJECT_DIR" ]; then
    echo "检测到已有项目目录，尝试停止并删除旧容器..."
    (cd "$PROJECT_DIR" && docker-compose down --rmi all || true)
    rm -rf "$PROJECT_DIR"
fi

# 克隆仓库
echo "[2/5] 克隆代码仓库..."
git clone "$REPO_URL" "$PROJECT_DIR"
cd "$PROJECT_DIR"

# 生成Dockerfile
echo "[3/5] 生成Docker配置文件..."
cat > Dockerfile <<EOF
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install --force
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm install --production --force

EXPOSE 3000
CMD ["npm", "start"]
EOF

# 生成docker-compose.yml
cat > docker-compose.yml <<EOF
version: '3.8'
services:
  web:
    build: .
    ports:
      - "${PORT}:3000"  # 外部端口4666映射到容器内部3000端口
    restart: unless-stopped
    environment:
      - NODE_ENV=production
EOF

# 构建并启动容器
echo "[4/5] 构建Docker容器..."
docker-compose up -d --build

# 显示部署结果
echo "[5/5] 部署完成！"
echo "----------------------------------------"
echo "访问地址: http://localhost:${PORT} 或 http://服务器IP:${PORT}"
echo "管理命令:"
echo "  停止服务: cd ${PROJECT_DIR} && docker-compose down"
echo "  查看日志: cd ${PROJECT_DIR} && docker-compose logs -f"
echo "----------------------------------------"
