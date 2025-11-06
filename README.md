# 一班史记

一个记录历史的网站，使用 Next.js 15、Supabase 和 Cloudflare Pages 构建。

## 功能特性

- 📝 创建历史记录页面（需要上传密钥）
- 🗑️ 删除历史记录（需要删除密钥）
- 🎨 美观的卡片式展示
- 📱 响应式设计

## 技术栈

- Next.js 15
- React 18
- TypeScript
- Supabase (数据库和存储)
- Cloudflare Pages (部署)

## 本地开发

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
创建 `.env.local` 文件，添加以下内容：
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. 运行开发服务器：
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 部署

### Cloudflare Pages 部署

1. 在 Cloudflare Dashboard 中创建新的 Pages 项目
2. 连接 GitHub 仓库
3. 构建命令：`npm run build`
4. 输出目录：`.next`
5. 添加环境变量（在 Cloudflare Dashboard 中）

## Supabase 配置

详见 `SUPABASE_SETUP.md`

