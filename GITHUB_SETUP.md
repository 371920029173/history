# GitHub 和 Cloudflare 部署指南

## 1. 初始化 Git 仓库并推送到 GitHub

如果 Git 已安装，在项目目录执行：

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 创建初始提交
git commit -m "Initial commit: 一班史记项目"

# 在 GitHub 上创建新仓库（通过网页或 GitHub CLI）
# 然后添加远程仓库并推送
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

如果 Git 未安装，请先安装 Git for Windows：https://git-scm.com/download/win

## 2. 部署到 Cloudflare Pages

### 方法一：通过 Cloudflare Dashboard（最简单）

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com
   - 登录你的账户

2. **创建 Pages 项目**
   - 点击左侧菜单的 "Workers & Pages"
   - 点击 "Create application" > "Pages" > "Connect to Git"
   - 授权 Cloudflare 访问你的 GitHub 账户
   - 选择刚创建的仓库

3. **配置构建设置**
   - **Project name**: `yiban-history`（或你喜欢的名字）
   - **Production branch**: `main`
   - **Framework preset**: `Next.js (Static HTML Export)`
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/`（留空或填 `/`）

4. **环境变量**（如果需要）
   - 在项目设置中可以添加环境变量
   - 当前项目不需要环境变量

5. **部署**
   - 点击 "Save and Deploy"
   - Cloudflare 会自动构建并部署你的项目

### 方法二：使用 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 构建项目
npm run build

# 部署到 Cloudflare Pages
wrangler pages deploy out --project-name=yiban-history
```

## 3. 重要注意事项

### ⚠️ 当前限制

由于 Cloudflare Pages 是静态托管服务，当前实现有以下限制：

1. **文件系统存储不可用**
   - `data/content.json` 文件无法在 Cloudflare Pages 上写入
   - 需要迁移到 Cloudflare KV 或 D1 数据库

2. **文件上传功能不可用**
   - `public/uploads/` 目录无法在运行时写入
   - 需要使用 Cloudflare R2 或其他对象存储

### 🔧 解决方案

#### 选项 A：使用 Cloudflare KV（推荐用于简单数据）

1. 在 Cloudflare Dashboard 创建 KV 命名空间
2. 修改 `lib/storage.ts` 使用 KV API
3. 在 `wrangler.toml` 中配置 KV 绑定

#### 选项 B：使用 Cloudflare D1（推荐用于复杂数据）

1. 在 Cloudflare Dashboard 创建 D1 数据库
2. 创建数据库表结构
3. 修改 `lib/storage.ts` 使用 D1 API

#### 选项 C：使用外部服务

- 使用 Supabase、Firebase 或其他后端服务
- 修改 API 路由调用外部 API

## 4. 部署后的访问

部署成功后，Cloudflare 会提供一个 URL，格式如：
`https://yiban-history.pages.dev`

你可以在 Cloudflare Dashboard 中设置自定义域名。

## 5. 后续更新

每次推送到 GitHub 的 `main` 分支，Cloudflare Pages 会自动重新部署。



