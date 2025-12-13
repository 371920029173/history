# Cloudflare Pages 配置说明

## 图1配置界面填写说明

根据你的截图，在 Cloudflare Pages 构建配置界面中：

### 构建命令（必填）
```
npm run build
```

### 部署命令（可选）
**留空** 或 **不填写**

⚠️ **重要**：对于 Next.js 静态导出项目，**不需要**部署命令。Cloudflare Pages 会自动部署构建输出目录中的文件。

如果你看到 `npx wrangler deploy`，这是用于 Cloudflare Workers 的，**不适用于 Cloudflare Pages**。

### 其他配置项

1. **Framework preset**: 选择 `Next.js (Static HTML Export)` 或 `None`
2. **Build output directory**: 填写 `out`（这是 Next.js 静态导出的默认输出目录）
3. **Root directory**: 留空或填写 `/`
4. **Node.js version**: 选择 `20.x` 或 `22.x`（推荐 20.x）

## 完整配置示例

```
项目名称: history
Framework preset: Next.js (Static HTML Export)
构建命令: npm run build
部署命令: (留空)
构建输出目录: out
根目录: / (或留空)
Node.js 版本: 20.x
```

## 注意事项

1. **不要使用 `npx wrangler deploy`** - 这是用于 Workers 的，不是 Pages
2. **确保构建输出目录是 `out`** - 这是 `next.config.js` 中 `output: 'export'` 配置的输出目录
3. **部署命令留空** - Cloudflare Pages 会自动处理部署

## 验证配置

配置完成后，点击"部署"按钮。如果构建成功，你应该看到：
- ✓ 依赖安装成功
- ✓ 构建成功
- ✓ 部署成功

然后就可以访问你的网站了！

