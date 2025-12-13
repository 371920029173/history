# 启动开发服务器并测试

Write-Host "=== 启动开发服务器 ===" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "✗ Node.js 未安装" -ForegroundColor Red
    exit 1
}

# 检查依赖
if (-not (Test-Path "node_modules")) {
    Write-Host "✗ 依赖未安装，请先运行: npm install" -ForegroundColor Red
    exit 1
}

Write-Host "正在启动开发服务器..." -ForegroundColor Yellow
Write-Host "服务器地址: http://localhost:3000" -ForegroundColor Cyan
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Gray
Write-Host ""

# 启动服务器
npm run dev

