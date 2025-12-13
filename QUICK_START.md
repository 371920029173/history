# 快速开始指南

## 本地开发

### 1. 安装依赖（如果还没安装）
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

服务器会在 http://localhost:3000 启动

### 3. 测试功能
- 访问主页查看效果
- 点击右下角 "+" 按钮创建内容
- 使用上传密钥：`ssfz2027n15662768895`
- 测试搜索和分类功能

## 部署到 Cloudflare Pages

### 前提条件
1. GitHub 账户
2. Cloudflare 账户（免费版即可）

### 步骤

#### 第一步：推送到 GitHub

**如果已安装 Git：**
```bash
git init
git add .
git commit -m "Initial commit"
# 在 GitHub 上创建新仓库，然后：
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

**如果没有安装 Git：**
1. 下载安装 Git：https://git-scm.com/download/win
2. 或使用 GitHub Desktop：https://desktop.github.com/
3. 或直接在 GitHub 网页上创建仓库并上传文件

#### 第二步：在 Cloudflare Pages 部署

1. 访问 https://dash.cloudflare.com
2. 点击左侧 "Workers & Pages"
3. 点击 "Create application" > "Pages" > "Connect to Git"
4. 授权并选择你的 GitHub 仓库
5. 配置：
   - **Framework preset**: `Next.js (Static HTML Export)`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
6. 点击 "Save and Deploy"

### ⚠️ 重要提示

由于 Cloudflare Pages 是静态托管，当前的文件系统存储**无法在生产环境工作**。

部署前需要：
1. 迁移数据存储到 Cloudflare KV 或 D1
2. 迁移文件上传到 Cloudflare R2

详细说明请查看 `GITHUB_SETUP.md`

## 测试清单

- [ ] 本地服务器正常启动
- [ ] 主页可以访问
- [ ] 可以创建内容
- [ ] 可以查看内容详情
- [ ] 搜索功能正常
- [ ] 分类筛选正常
- [ ] 文件上传功能正常（本地）

## 常见问题

**Q: 服务器启动失败？**
- 检查 Node.js 是否已安装：`node --version`
- 检查端口 3000 是否被占用
- 删除 `node_modules` 和 `package-lock.json`，重新运行 `npm install`

**Q: 无法访问 localhost:3000？**
- 检查防火墙设置
- 尝试使用 `http://127.0.0.1:3000`

**Q: Git 命令不可用？**
- 安装 Git for Windows
- 或使用 GitHub Desktop 图形界面工具



