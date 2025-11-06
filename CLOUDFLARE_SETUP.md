# Cloudflare Pages 配置详细指南

## 为什么需要 Edge Runtime？

Cloudflare Pages 使用 Edge Runtime 来运行 Next.js API 路由。Edge Runtime 是一个轻量级的运行时环境，专门为边缘计算优化。

## Edge Runtime 要求

所有 API 路由必须：

1. 导出 `runtime = 'edge'`
2. 使用 Edge Runtime 兼容的 API
3. 不能使用 Node.js 特定的 API（如 `fs`、`path` 等）

## 已配置的 Edge Runtime API 路由

项目中的以下 API 路由已配置为 Edge Runtime：

- `app/api/entries/route.ts` - 获取和创建历史记录
- `app/api/entries/[id]/route.ts` - 获取和删除单个历史记录

## Cloudflare Pages 特定配置

### 1. Next.js 配置

`next.config.js` 已配置为支持 Cloudflare Pages：

```javascript
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
}
```

### 2. 构建输出

Cloudflare Pages 会自动检测 Next.js 项目并使用正确的构建命令。

### 3. 环境变量

在 Cloudflare Pages Dashboard 中配置环境变量：

1. 进入你的 Pages 项目
2. 点击 "Settings" > "Environment variables"
3. 添加以下变量：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 Supabase anon key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | 你的 Supabase service_role key | Production, Preview, Development |

### 4. 函数配置

Cloudflare Pages 会自动将 `app/api` 目录下的路由转换为 Cloudflare Functions。

## 部署检查清单

- [ ] GitHub 仓库已创建并推送代码
- [ ] Supabase 项目已创建并配置
- [ ] Supabase 数据库表已创建
- [ ] Supabase RLS 策略已配置
- [ ] Cloudflare Pages 项目已创建
- [ ] 环境变量已配置
- [ ] 构建成功
- [ ] 网站可以正常访问
- [ ] 创建记录功能正常
- [ ] 删除记录功能正常

## 常见问题

### Q: 为什么 API 路由返回 404？

A: 确保：
1. API 路由文件在 `app/api` 目录下
2. 文件导出了正确的 HTTP 方法（GET, POST, DELETE 等）
3. 路由设置了 `export const runtime = 'edge'`

### Q: 为什么 Supabase 连接失败？

A: 检查：
1. 环境变量是否正确配置
2. Supabase 项目是否正常运行
3. RLS 策略是否允许相应操作

### Q: 如何查看部署日志？

A: 在 Cloudflare Pages Dashboard 中：
1. 进入你的项目
2. 点击 "Deployments"
3. 选择最新的部署
4. 查看构建日志和函数日志

