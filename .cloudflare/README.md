# Cloudflare Pages 部署说明

## 方法一：通过 Cloudflare Dashboard（推荐）

1. 登录 Cloudflare Dashboard
2. 进入 Pages 部分
3. 点击 "Create a project"
4. 连接你的 GitHub 仓库
5. 配置构建设置：
   - **Framework preset**: Next.js (Static HTML Export)
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
   - **Root directory**: `/` (项目根目录)

## 方法二：使用 Wrangler CLI

```bash
npm install -g wrangler
wrangler login
wrangler pages deploy out --project-name=yiban-history
```

## 注意事项

由于当前使用文件系统存储，部署到 Cloudflare Pages 后需要：

1. **迁移到 Cloudflare KV**（推荐）：
   - 在 Cloudflare Dashboard 创建 KV 命名空间
   - 修改 `lib/storage.ts` 使用 KV API
   - 在 `wrangler.toml` 中配置 KV 绑定

2. **或使用 Cloudflare D1**：
   - 创建 D1 数据库
   - 修改存储层使用 SQLite

3. **文件上传**：
   - Cloudflare Pages 是静态托管，不支持文件上传
   - 需要使用 Cloudflare R2 或其他对象存储服务
   - 或使用 Cloudflare Workers 处理文件上传

## 环境变量

如果需要，可以在 Cloudflare Pages 设置中添加环境变量。



