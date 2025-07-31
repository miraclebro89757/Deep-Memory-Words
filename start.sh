#!/bin/bash

echo "🚀 单词记忆故事生成器 - 快速启动"
echo "=================================="

# 检查Node.js版本
echo "📋 检查Node.js版本..."
node_version=$(node -v)
echo "当前Node.js版本: $node_version"

# 检查cnpm是否安装
if ! command -v cnpm &> /dev/null; then
    echo "❌ cnpm未安装，请先安装cnpm"
    echo "安装命令: npm install -g cnpm --registry=https://registry.npmmirror.com"
    exit 1
fi

echo "✅ cnpm已安装"

# 安装依赖
echo "📦 安装项目依赖..."
cnpm install

if [ $? -eq 0 ]; then
    echo "✅ 依赖安装成功"
else
    echo "❌ 依赖安装失败"
    exit 1
fi

# 启动开发服务器
echo "🌐 启动开发服务器..."
echo "项目将在 http://localhost:3000 启动"
echo "按 Ctrl+C 停止服务器"
echo ""

cnpm run dev 