# Cloudflare Pages 部署指南（使用 wrangler.toml）

## 1. 推送代码到 GitHub

```bash
# 如果还没有连接远程仓库
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## 2. Cloudflare Pages 配置

### 方式一：使用 Cloudflare Dashboard（推荐）

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 "Workers & Pages" > "Create application" > "Pages" > "Connect to Git"
3. 选择你的 GitHub 仓库
4. 配置构建设置：
   - **Project name**: `history-website`
   - **Production branch**: `main`
   - **Framework preset**: `Next.js`
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`

### 方式二：使用 Wrangler CLI

安装 Wrangler CLI：

```bash
npm install -g wrangler
```

登录 Cloudflare：

```bash
wrangler login
```

## 3. 环境变量配置（使用 wrangler.toml + Wrangler CLI）

### 方式一：完全使用 wrangler.toml + Wrangler CLI（推荐）

**优点：**
- 不需要在 Cloudflare Dashboard 中填写环境变量
- 敏感变量可以随时修改（使用 `wrangler secret put`）
- 配置更灵活，不会被锁定

**步骤：**

1. **公开变量已在 wrangler.toml 中配置**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SUPABASE_BUCKET`

2. **设置敏感变量（使用 Wrangler CLI）**

   安装 Wrangler CLI（如果还没安装）：
   ```bash
   npm install -g wrangler
   ```

   登录 Cloudflare：
   ```bash
   wrangler login
   ```

   设置敏感变量：
   ```bash
   wrangler secret put SUPABASE_SERVICE_ROLE_KEY
   ```
   然后粘贴你的 service_role key：
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoeGVza3JkZXphYWhoYmZ0b25uIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjQzNzI1OSwiZXhwIjoyMDc4MDEzMjU5fQ.gJ0xkRCjUtKLE0mN9bur8RAS7m_YolusS1BZAVY44Jo
   ```

3. **验证已设置的变量**
   ```bash
   wrangler secret list
   ```

4. **如果需要修改敏感变量**
   ```bash
   wrangler secret put SUPABASE_SERVICE_ROLE_KEY
   # 再次输入新值即可
   ```

### 方式二：在 Cloudflare Dashboard 中配置（备选）

如果不想使用 Wrangler CLI，也可以在 Dashboard 中配置：

1. 进入你的 Pages 项目
2. 点击 "Settings" > "Environment variables"
3. 添加变量（注意：一旦设置为"机密"，可能无法修改）

**推荐使用方式一**，因为更灵活且可以随时修改。

## 4. 部署

### 自动部署（推荐）

当你推送代码到 GitHub 的 `main` 分支时，Cloudflare Pages 会自动构建和部署。

### 手动部署（使用 Wrangler）

```bash
npm run build
wrangler pages deploy .next
```

## 5. 验证部署

1. 访问你的 Cloudflare Pages URL（例如：`https://history-website.pages.dev`）
2. 测试功能：
   - 查看主页
   - 创建新记录（使用上传密钥：`ssfz2027n15662768895`）
   - 搜索功能
   - 删除记录（使用删除密钥：`ssfz2027371920029173`）

## 注意事项

1. **Edge Runtime**: 所有 API 路由已配置为 `export const runtime = 'edge'`，符合 Cloudflare Pages 要求
2. **环境变量**: `NEXT_PUBLIC_*` 变量在构建时注入，`SUPABASE_SERVICE_ROLE_KEY` 在运行时使用
3. **背景图片**: 确保 `public/background.jpg` 文件已包含在仓库中
4. **Supabase 存储**: 确保已创建 `history-images` 存储桶并配置了正确的策略

## 故障排除

如果部署失败：
1. 检查构建日志中的错误信息
2. 确认所有环境变量都已正确配置
3. 确认 Supabase 数据库表已创建（参考 `SUPABASE_SETUP.md`）
4. 检查 `wrangler.toml` 配置是否正确

