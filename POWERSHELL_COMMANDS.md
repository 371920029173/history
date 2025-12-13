# PowerShell 命令清单

## 检查环境

```powershell
# 检查 Node.js
node --version

# 检查 npm
npm --version

# 检查 Git
git --version
```

如果命令不存在，需要先安装：
- Node.js: https://nodejs.org/
- Git: https://git-scm.com/download/win

## 安装依赖

```powershell
npm install
```

## 启动开发服务器

```powershell
npm run dev
```

服务器启动后，访问 http://localhost:3000

按 `Ctrl+C` 停止服务器

## 构建生产版本

```powershell
npm run build
```

## Git 操作（推送到 GitHub）

```powershell
# 1. 初始化 Git 仓库
git init

# 2. 添加所有文件
git add .

# 3. 创建初始提交
git commit -m "Initial commit: 一班史记项目"

# 4. 在 GitHub 网页上创建新仓库，然后添加远程仓库
# 替换下面的 URL 为你的实际仓库地址
git remote add origin https://github.com/你的用户名/仓库名.git

# 5. 设置主分支
git branch -M main

# 6. 推送到 GitHub
git push -u origin main
```

## 后续更新（修改代码后）

```powershell
git add .
git commit -m "更新说明"
git push
```

## Cloudflare Pages 部署

1. 访问 https://dash.cloudflare.com
2. Workers & Pages > Create application > Pages > Connect to Git
3. 选择你的 GitHub 仓库
4. 配置：
   - Framework preset: `Next.js (Static HTML Export)`
   - Build command: `npm run build`
   - Build output directory: `out`
5. 点击 Save and Deploy

部署完成后，每次推送到 GitHub 的 main 分支，Cloudflare 会自动重新部署。



