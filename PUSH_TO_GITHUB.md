# 推送到 GitHub 和 Cloudflare 配置

## 推送到 GitHub

由于 Git 未安装，请使用以下方法之一：

### 方法一：使用 GitHub Desktop（推荐）
1. 下载安装：https://desktop.github.com/
2. 打开 GitHub Desktop
3. File > Add Local Repository
4. 选择当前项目目录
5. 填写提交信息："Initial commit: 一班史记项目"
6. 点击 Commit to main
7. 点击 Push origin

### 方法二：在 GitHub 网页上传
1. 访问 https://github.com/371920029173/history
2. 点击 "uploading an existing file"
3. 拖拽所有项目文件（除了 node_modules, .next, out 等）
4. 填写提交信息并提交

### 方法三：安装 Git 后使用命令行
```powershell
# 安装 Git: https://git-scm.com/download/win
# 然后执行：
git init
git add .
git commit -m "Initial commit: 一班史记项目"
git remote add origin https://github.com/371920029173/history.git
git branch -M main
git push -u origin main
```

## Cloudflare Pages 配置

根据你的截图，配置如下：

### 构建配置
- **项目名称**: `history`
- **构建命令**: `npm run build` ✅ 正确
- **部署命令**: `npx wrangler deploy` ⚠️ 这个通常不需要

### 重要说明

对于 Next.js 静态导出到 Cloudflare Pages：

1. **构建输出目录**: 应该是 `out`（在 Cloudflare 设置中配置）
2. **部署命令**: 通常**不需要**，Cloudflare Pages 会自动部署 `out` 目录
3. **如果使用 wrangler deploy**：需要先安装 wrangler 并配置 `wrangler.toml`

### 推荐的 Cloudflare Pages 配置

在 Cloudflare Dashboard 中：

1. **Framework preset**: `Next.js (Static HTML Export)` 或 `None`
2. **Build command**: `npm run build`
3. **Build output directory**: `out`
4. **Root directory**: `/`（留空）
5. **Deploy command**: **留空**（不需要）

### 如果必须使用 wrangler deploy

需要修改 `wrangler.toml` 并确保：
- 已安装 wrangler: `npm install -g wrangler`
- 已登录: `wrangler login`
- 配置正确的项目名称

## 当前项目状态

✅ 项目文件已准备就绪
✅ Next.js 配置为静态导出（`output: 'export'`）
✅ 构建输出到 `out` 目录
⚠️ 需要推送到 GitHub
⚠️ 需要在 Cloudflare 配置构建输出目录为 `out`

## 部署后注意事项

⚠️ **重要**：当前使用文件系统存储，在 Cloudflare Pages 上**无法工作**，因为：
- Cloudflare Pages 是静态托管，无法写入文件系统
- `data/content.json` 无法在运行时写入
- `public/uploads/` 无法在运行时写入

**解决方案**：
1. 迁移到 Cloudflare KV（键值存储）
2. 或使用 Cloudflare D1（SQLite 数据库）
3. 或使用外部 API 服务



