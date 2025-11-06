# Git 使用指南

## 初始设置

### 1. 安装 Git

如果还没有安装 Git，请访问 [https://git-scm.com/downloads](https://git-scm.com/downloads) 下载并安装。

### 2. 配置 Git（首次使用）

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 推送代码到 GitHub

### 步骤 1: 初始化仓库

在项目根目录执行：

```bash
git init
```

### 步骤 2: 添加文件

```bash
git add .
```

### 步骤 3: 创建首次提交

```bash
git commit -m "Initial commit: 一班史记网站"
```

### 步骤 4: 创建 GitHub 仓库

1. 访问 [https://github.com/new](https://github.com/new)
2. 填写仓库名称（例如：`history-website`）
3. 选择 Public 或 Private
4. **不要**勾选 "Initialize this repository with a README"
5. 点击 "Create repository"

### 步骤 5: 连接远程仓库

在 GitHub 创建仓库后，会显示一个 URL，类似：
```
https://github.com/YOUR_USERNAME/history-website.git
```

在项目根目录执行（替换为你的实际 URL）：

```bash
git remote add origin https://github.com/YOUR_USERNAME/history-website.git
```

### 步骤 6: 推送代码

```bash
git branch -M main
git push -u origin main
```

如果提示输入用户名和密码：
- 用户名：你的 GitHub 用户名
- 密码：使用 Personal Access Token（不是 GitHub 密码）

### 创建 Personal Access Token

1. 访问 [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token" > "Generate new token (classic)"
3. 填写 Note（例如：`Cloudflare Pages`）
4. 选择过期时间
5. 勾选 `repo` 权限
6. 点击 "Generate token"
7. 复制生成的 token（只显示一次）
8. 在推送时使用这个 token 作为密码

## 后续更新代码

当你修改代码后，使用以下命令推送更新：

```bash
# 查看修改的文件
git status

# 添加所有修改
git add .

# 提交修改
git commit -m "描述你的修改"

# 推送到 GitHub
git push
```

## 常用 Git 命令

```bash
# 查看状态
git status

# 查看提交历史
git log

# 查看差异
git diff

# 撤销未提交的修改
git checkout -- <file>

# 撤销已暂存的修改
git reset HEAD <file>
```

## 分支管理（可选）

如果需要创建新分支：

```bash
# 创建并切换到新分支
git checkout -b feature/new-feature

# 切换回主分支
git checkout main

# 合并分支
git merge feature/new-feature

# 删除分支
git branch -d feature/new-feature
```

