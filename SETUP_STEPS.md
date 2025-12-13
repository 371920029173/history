# 设置步骤（PowerShell 命令）

## 第一步：安装 Node.js（如果还没安装）

1. 下载 Node.js：https://nodejs.org/ （选择 LTS 版本）
2. 安装后重启 PowerShell
3. 验证安装：
```powershell
node --version
npm --version
```

## 第二步：安装项目依赖

```powershell
npm install
```

## 第三步：启动开发服务器测试

```powershell
npm run dev
```

然后在浏览器访问 http://localhost:3000 测试功能

## 第四步：初始化 Git 并推送到 GitHub

### 如果已安装 Git：

```powershell
# 初始化仓库
git init

# 添加文件
git add .

# 创建提交
git commit -m "Initial commit: 一班史记项目"

# 在 GitHub 上创建新仓库（通过网页），然后：
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

### 如果没有安装 Git：

1. 下载安装：https://git-scm.com/download/win
2. 或使用 GitHub Desktop：https://desktop.github.com/
3. 安装后重启 PowerShell，然后执行上面的命令

## 第五步：部署到 Cloudflare Pages

1. 访问 https://dash.cloudflare.com
2. Workers & Pages > Create application > Pages > Connect to Git
3. 选择你的 GitHub 仓库
4. 配置：
   - Framework preset: `Next.js (Static HTML Export)`
   - Build command: `npm run build`
   - Build output directory: `out`
5. Save and Deploy

## 注意事项

⚠️ **重要**：当前使用文件系统存储，部署到 Cloudflare Pages 后需要迁移到 Cloudflare KV 或 D1 数据库才能正常工作。



