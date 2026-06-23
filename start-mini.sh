#!/bin/bash
# 乌东文旅小程序端启动脚本
# 注意：小程序端需要使用微信开发者工具打开 miniprogram/ 目录

set -e

MINI_DIR="$(cd "$(dirname "$0")/miniprogram" && pwd)"

echo "=========================================="
echo "  乌东文旅 小程序端"
echo "=========================================="
echo ""
echo "目录: $MINI_DIR"
echo ""
echo "启动方式："
echo "  1. 打开微信开发者工具"
echo "  2. 导入项目，选择: $MINI_DIR"
echo "  3. AppID: 填入你的小程序 AppID"
echo "  4. 勾选『不校验合法域名』"
echo "  5. 编译运行"
echo ""
echo "后端 API 需运行在: http://localhost:8001"
echo ""
