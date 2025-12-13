# 部署说明

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 运行开发服务器：
```bash
npm run dev
```

3. 访问 http://localhost:3000

## 设置背景图片

1. 将背景图片命名为 `background.jpg`
2. 放置在 `public/` 目录下
3. 在 `app/page.module.css` 中取消注释背景图片相关代码，注释掉渐变背景代码

## 部署到 Cloudflare Pages

### 方法一：使用 Cloudflare Pages（推荐）

1. 在 Cloudflare Dashboard 中创建新的 Pages 项目
2. 连接你的 Git 仓库
3. 构建配置：
   - 构建命令：`npm run build`
   - 构建输出目录：`out`
   - Node.js 版本：18 或更高

### 方法二：使用 Cloudflare Workers + Pages

由于当前使用文件系统存储，需要迁移到 Cloudflare KV：

1. 在 Cloudflare Dashboard 中创建 KV 命名空间
2. 修改 `lib/storage.ts` 使用 KV API
3. 使用 `@cloudflare/next-on-pages` 适配器

### 数据存储

当前使用 JSON 文件存储（`data/content.json`），适合开发环境。

生产环境建议：
- 使用 Cloudflare KV（键值存储）
- 或使用 Cloudflare D1（SQLite 数据库）
- 或使用外部数据库服务

## 密钥管理

- 上传密钥：`ssfz2027n15662768895`
- 删除密钥：`ssfz2027371920029173`

密钥已加密存储在代码中，每次使用后会自动清除（概念性实现）。

## 注意事项

1. 确保 `public/uploads/` 目录有写入权限
2. 确保 `data/` 目录有写入权限
3. 上传的文件会保存在 `public/uploads/` 目录
4. 内容数据保存在 `data/content.json` 文件中



