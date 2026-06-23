#!/bin/bash
# 乌东文旅 PC 端启动脚本
# 启动前确保后端 API 已在运行 (http://localhost:8001)

set -e

PC_WEB_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$PC_WEB_DIR"

if command -v fnm > /dev/null 2>&1; then
  eval "$(fnm env --shell bash)"
  fnm use --install-if-missing
elif [ -s "$HOME/.nvm/nvm.sh" ]; then
  . "$HOME/.nvm/nvm.sh"
  nvm install
  nvm use
fi

echo "=========================================="
echo "  乌东文旅 PC 端"
echo "=========================================="
echo ""
echo "目录: $PC_WEB_DIR"
echo "端口: 3000"
echo "访问: http://localhost:3000"
echo ""

# 检查 Node 版本
NODE_VER=$(node -v | sed 's/v//')
MAJOR=$(echo "$NODE_VER" | cut -d. -f1)
if [ "$MAJOR" -lt 22 ]; then
  echo "错误: 需要 Node.js >= 22.0.0，当前版本: v$NODE_VER"
  echo "请使用 fnm 升级: fnm install 22 && fnm use 22"
  echo "或使用 nvm 升级: nvm install 22 && nvm use 22"
  exit 1
fi
echo "Node 版本: v$NODE_VER ✓"
echo ""

# 检查后端
echo "检查后端 API..."
if curl -s http://localhost:8001/admin/base/open/eps > /dev/null 2>&1; then
  echo "后端 API 运行中 ✓"
else
  echo "警告: 后端 API 未运行 (http://localhost:8001)"
  echo "请先启动后端: cd ../cool-admin-midway && npm run dev"
fi
echo ""

# 安装依赖
if [ ! -d "node_modules" ]; then
  echo "[1/2] 安装依赖..."
  npm install
  echo ""
fi

echo "[2/2] 启动开发服务器..."
echo ""
npm run dev
