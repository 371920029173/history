# 自动安装依赖并测试项目

Write-Host "=== 一班史记项目 - 安装和测试脚本 ===" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js
Write-Host "检查 Node.js..." -ForegroundColor Yellow
$nodeCheck = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeCheck) {
    Write-Host "✗ Node.js 未安装或未添加到 PATH" -ForegroundColor Red
    Write-Host "请先安装 Node.js，然后重新运行此脚本" -ForegroundColor Yellow
    Write-Host "下载地址: https://nodejs.org/" -ForegroundColor Gray
    exit 1
}

$nodeVersion = node --version
$npmVersion = npm --version
Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
Write-Host "✓ npm: v$npmVersion" -ForegroundColor Green
Write-Host ""

# 检查项目文件
Write-Host "检查项目文件..." -ForegroundColor Yellow
if (-not (Test-Path "package.json")) {
    Write-Host "✗ package.json 不存在" -ForegroundColor Red
    exit 1
}
Write-Host "✓ package.json 存在" -ForegroundColor Green
Write-Host ""

# 安装依赖
Write-Host "安装项目依赖（这可能需要几分钟）..." -ForegroundColor Yellow
Write-Host ""
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ 依赖安装失败" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
    Write-Host "✓ 依赖安装完成" -ForegroundColor Green
} catch {
    Write-Host "✗ 安装过程出错: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# 检查 node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "✗ node_modules 目录不存在" -ForegroundColor Red
    exit 1
}
Write-Host "✓ node_modules 目录已创建" -ForegroundColor Green
Write-Host ""

# 创建必要的目录
Write-Host "创建必要的目录..." -ForegroundColor Yellow
$dirs = @("data", "public\uploads")
foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✓ 创建目录: $dir" -ForegroundColor Gray
    }
}
Write-Host ""

# 测试构建
Write-Host "测试项目构建..." -ForegroundColor Yellow
Write-Host ""
try {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ 构建失败" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
    Write-Host "✓ 构建成功！" -ForegroundColor Green
} catch {
    Write-Host "✗ 构建过程出错: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== 所有检查通过！===" -ForegroundColor Green
Write-Host ""
Write-Host "下一步操作:" -ForegroundColor Cyan
Write-Host "1. 启动开发服务器: npm run dev" -ForegroundColor Yellow
Write-Host "2. 在浏览器访问: http://localhost:3000" -ForegroundColor Yellow
Write-Host "3. 测试功能后，推送到 GitHub" -ForegroundColor Yellow
Write-Host ""

