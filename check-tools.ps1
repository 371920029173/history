# 检查所有必需工具的状态

Write-Host "=== 工具检查 ===" -ForegroundColor Cyan
Write-Host ""

# 检查 Git
Write-Host "检查 Git..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>&1
    if ($LASTEXITCODE -eq 0 -or $gitVersion -like "*git version*") {
        Write-Host "✓ Git 已安装: $gitVersion" -ForegroundColor Green
        $gitPath = (Get-Command git -ErrorAction SilentlyContinue).Source
        Write-Host "  路径: $gitPath" -ForegroundColor Gray
    } else {
        Write-Host "✗ Git 未安装或未添加到 PATH" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Git 未安装或未添加到 PATH" -ForegroundColor Red
}

Write-Host ""

# 检查 Node.js
Write-Host "检查 Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -eq 0 -or $nodeVersion -like "v*") {
        Write-Host "✓ Node.js 已安装: $nodeVersion" -ForegroundColor Green
        $nodePath = (Get-Command node -ErrorAction SilentlyContinue).Source
        Write-Host "  路径: $nodePath" -ForegroundColor Gray
    } else {
        Write-Host "✗ Node.js 未安装或未添加到 PATH" -ForegroundColor Red
        Write-Host "  下载地址: https://nodejs.org/ (选择 LTS 版本)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Node.js 未安装或未添加到 PATH" -ForegroundColor Red
    Write-Host "  下载地址: https://nodejs.org/ (选择 LTS 版本)" -ForegroundColor Gray
}

Write-Host ""

# 检查 npm
Write-Host "检查 npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>&1
    if ($LASTEXITCODE -eq 0 -or $npmVersion -match "^\d+\.\d+\.\d+") {
        Write-Host "✓ npm 已安装: v$npmVersion" -ForegroundColor Green
    } else {
        Write-Host "✗ npm 未安装（通常随 Node.js 一起安装）" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ npm 未安装（通常随 Node.js 一起安装）" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== 项目检查 ===" -ForegroundColor Cyan
Write-Host ""

# 检查项目依赖
if (Test-Path "node_modules") {
    Write-Host "✓ node_modules 目录存在" -ForegroundColor Green
} else {
    Write-Host "✗ node_modules 目录不存在（需要运行 npm install）" -ForegroundColor Yellow
}

if (Test-Path "package.json") {
    Write-Host "✓ package.json 存在" -ForegroundColor Green
} else {
    Write-Host "✗ package.json 不存在" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== 下一步操作 ===" -ForegroundColor Cyan
Write-Host ""

$allReady = $true

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "1. 安装 Git: https://git-scm.com/download/win" -ForegroundColor Yellow
    $allReady = $false
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "2. 安装 Node.js: https://nodejs.org/ (选择 LTS 版本)" -ForegroundColor Yellow
    $allReady = $false
}

if (-not (Test-Path "node_modules")) {
    Write-Host "3. 安装项目依赖: npm install" -ForegroundColor Yellow
    $allReady = $false
}

if ($allReady) {
    Write-Host "✓ 所有工具已就绪！可以开始开发了" -ForegroundColor Green
    Write-Host "  运行 'npm run dev' 启动开发服务器" -ForegroundColor Cyan
} else {
    Write-Host "请先完成上述步骤" -ForegroundColor Red
}

