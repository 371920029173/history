# Supabase 配置指南

## 1. 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 注册/登录账号
3. 点击 "New Project"
4. 填写项目信息：
   - Project Name: history-website (或任意名称)
   - Database Password: 设置一个强密码（请保存好）
   - Region: 选择离你最近的区域
5. 点击 "Create new project"，等待项目创建完成（约 2 分钟）

## 2. 获取 API 密钥

1. 在项目 Dashboard 中，点击左侧菜单的 "Settings" (齿轮图标)
2. 点击 "API"
3. 复制以下信息：
   - **Project URL** (例如: `https://xxxxx.supabase.co`)
   - **anon public** key (在 "Project API keys" 部分)

## 3. 创建数据库表

1. 在 Supabase Dashboard 中，点击左侧菜单的 "SQL Editor"
2. 点击 "New query"
3. 复制并执行以下 SQL 语句：

```sql
-- 创建历史记录表
CREATE TABLE IF NOT EXISTS history_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_history_entries_created_at ON history_entries(created_at DESC);

-- 启用 Row Level Security (RLS)
ALTER TABLE history_entries ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有人读取
CREATE POLICY "Allow public read access" ON history_entries
  FOR SELECT
  USING (true);

-- 创建策略：允许通过服务角色密钥插入（用于 API）
-- 注意：实际应用中，你应该使用服务角色密钥在服务器端操作
-- 这里为了简化，我们允许匿名插入，但实际应该通过 API 路由处理
CREATE POLICY "Allow public insert" ON history_entries
  FOR INSERT
  WITH CHECK (true);

-- 创建策略：允许通过服务角色密钥删除
CREATE POLICY "Allow public delete" ON history_entries
  FOR DELETE
  USING (true);
```

## 4. 配置存储（可选，用于图片上传）

如果你需要上传图片：

1. 在 Supabase Dashboard 中，点击左侧菜单的 "Storage"
2. 点击 "Create a new bucket"
3. 设置：
   - Name: `history-images`
   - Public bucket: ✅ (勾选，使图片可公开访问)
4. 点击 "Create bucket"
5. 在 "Policies" 标签页，添加策略：

```sql
-- 允许所有人读取
CREATE POLICY "Public Access" ON storage.objects FOR SELECT
USING (bucket_id = 'history-images');

-- 允许所有人上传
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'history-images');

-- 允许所有人删除
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE
USING (bucket_id = 'history-images');
```

## 5. 环境变量配置

在你的项目根目录创建 `.env.local` 文件：

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**重要：** 对于生产环境，你应该使用服务角色密钥（service_role key）在服务器端 API 路由中进行写入和删除操作，而不是使用 anon key。anon key 应该只用于客户端读取操作。

## 6. 使用服务角色密钥（推荐用于生产环境）

1. 在 Supabase Dashboard 的 "Settings" > "API" 中
2. 找到 "service_role" key（⚠️ 这个密钥有完整权限，不要暴露在客户端）
3. 在 Cloudflare Pages 的环境变量中添加：
   - `SUPABASE_SERVICE_ROLE_KEY` (仅服务器端使用)

然后在 API 路由中使用这个密钥进行写入和删除操作。

