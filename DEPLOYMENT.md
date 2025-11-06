# 部署指南

## 1. 准备 GitHub 仓库

### 1.1 初始化 Git 仓库

在项目根目录执行：

```bash
git init
git add .
git commit -m "Initial commit"
```

### 1.2 创建 GitHub 仓库

1. 访问 [GitHub](https://github.com)
2. 点击右上角的 "+" 号，选择 "New repository"
3. 填写仓库信息：
   - Repository name: `history-website` (或任意名称)
   - Description: 一班史记网站
   - 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"
4. 点击 "Create repository"

### 1.3 推送代码到 GitHub

在项目根目录执行（替换 `YOUR_USERNAME` 和 `YOUR_REPO_NAME`）：

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## 2. 配置 Supabase

### 2.1 创建 Supabase 项目

参考 `SUPABASE_SETUP.md` 文件完成 Supabase 配置。

### 2.2 获取环境变量

在 Supabase Dashboard 的 Settings > API 中获取：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (可选，但推荐用于生产环境)

## 3. 配置 Cloudflare Pages

### 3.1 创建 Cloudflare Pages 项目

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 登录你的账号
3. 在左侧菜单选择 "Workers & Pages"
4. 点击 "Create application" > "Pages" > "Connect to Git"
5. 选择你的 GitHub 账号并授权
6. 选择你刚创建的仓库
7. 点击 "Begin setup"

### 3.2 配置构建设置

在 "Set up builds and deployments" 页面：

- **Project name**: `history-website` (或任意名称)
- **Production branch**: `main`
- **Framework preset**: `Next.js`
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/` (留空)

### 3.3 配置环境变量

在 "Environment variables" 部分，添加以下变量：

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: 你的 Supabase Project URL
   - Environment: Production, Preview, Development (全部勾选)

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: 你的 Supabase anon public key
   - Environment: Production, Preview, Development (全部勾选)

3. **SUPABASE_SERVICE_ROLE_KEY** (推荐)
   - Value: 你的 Supabase service_role key
   - Environment: Production, Preview, Development (全部勾选)
   - ⚠️ 注意：这个密钥有完整权限，不要暴露在客户端

### 3.4 保存并部署

1. 点击 "Save and Deploy"
2. 等待构建完成（约 2-5 分钟）
3. 构建成功后，你会获得一个 Cloudflare Pages URL，例如：`https://history-website.pages.dev`

### 3.5 自定义域名（可选）

1. 在 Cloudflare Pages 项目页面，点击 "Custom domains"
2. 点击 "Set up a custom domain"
3. 输入你的域名
4. 按照提示配置 DNS 记录

## 4. 添加背景图片

1. 将背景图片命名为 `background.jpg`（或 `background.png`）
2. 将图片放在 `public` 目录下
3. 如果图片名称不同，修改 `app/page.module.css` 中的 `background-image` URL

## 5. 验证部署

1. 访问你的 Cloudflare Pages URL
2. 测试以下功能：
   - 查看主页是否正常显示
   - 创建新记录（使用上传密钥）
   - 查看详情页
   - 删除记录（使用删除密钥）

## 6. 更新代码

当你需要更新代码时：

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Cloudflare Pages 会自动检测到推送并重新部署。

## 故障排除

### 构建失败

1. 检查环境变量是否正确配置
2. 查看 Cloudflare Pages 的构建日志
3. 确保 `package.json` 中的依赖版本正确

### API 路由不工作

1. 确保所有 API 路由都设置了 `export const runtime = 'edge'`
2. 检查 Supabase 环境变量是否正确
3. 查看 Cloudflare Pages 的 Functions 日志

### 数据库连接失败

1. 检查 Supabase 项目是否正常运行
2. 验证环境变量中的 URL 和密钥是否正确
3. 检查 Supabase 的 RLS (Row Level Security) 策略是否正确配置

