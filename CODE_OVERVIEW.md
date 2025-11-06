# 代码概览

本文档包含项目的所有关键代码文件。

## 项目结构

```
history/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API 路由（Edge Runtime）
│   │   └── entries/
│   ├── create/            # 创建页面
│   ├── entry/[id]/        # 详情页面
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 主页
│   └── globals.css        # 全局样式
├── lib/                    # 工具库
│   ├── supabase.ts        # Supabase 客户端
│   ├── crypto.ts          # 密钥验证
│   └── types.ts           # TypeScript 类型
├── public/                 # 静态资源
├── package.json           # 依赖配置
├── next.config.js         # Next.js 配置
└── tsconfig.json          # TypeScript 配置
```

## 核心文件

### 1. package.json

```json
{
  "name": "history-website",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@supabase/supabase-js": "^2.39.0",
    "crypto-js": "^4.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "@types/crypto-js": "^4.2.1",
    "typescript": "^5.3.3",
    "eslint": "^8.56.0",
    "eslint-config-next": "^15.0.0"
  }
}
```

### 2. lib/supabase.ts

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 客户端 Supabase 实例（用于读取）
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 服务端 Supabase 实例（用于写入和删除，如果有服务角色密钥）
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : supabase
```

### 3. lib/crypto.ts

```typescript
import CryptoJS from 'crypto-js'

// 加密密钥（用于加密存储的密钥）
const ENCRYPTION_KEY = 'history_website_encryption_key_2024'

// 上传密钥（原始值）
const UPLOAD_KEY = 'ssfz2027n15662768895'
// 删除密钥（原始值）
const DELETE_KEY = 'ssfz2027371920029173'

// 验证上传密钥
export function verifyUploadKey(inputKey: string): boolean {
  return inputKey === UPLOAD_KEY
}

// 验证删除密钥
export function verifyDeleteKey(inputKey: string): boolean {
  return inputKey === DELETE_KEY
}

// 生成加密的密钥哈希（用于在客户端显示时隐藏真实密钥）
export function getKeyHash(key: string): string {
  return CryptoJS.SHA256(key).toString().substring(0, 16)
}
```

### 4. lib/types.ts

```typescript
export interface HistoryEntry {
  id: string
  title?: string
  description?: string
  content?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface CreateHistoryEntry {
  title?: string
  description?: string
  content?: string
  image_url?: string
}
```

### 5. app/api/entries/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyUploadKey } from '@/lib/crypto'

export const runtime = 'edge'

// GET: 获取所有历史记录
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('history_entries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching entries:', error)
      return NextResponse.json(
        { error: 'Failed to fetch entries' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: 创建新的历史记录
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, title, description, content, image_url } = body

    // 验证密钥
    if (!key || !verifyUploadKey(key)) {
      return NextResponse.json(
        { error: 'Invalid upload key' },
        { status: 401 }
      )
    }

    // 验证至少有一个字段
    if (!title && !description && !content && !image_url) {
      return NextResponse.json(
        { error: 'At least one field (title, description, content, or image_url) is required' },
        { status: 400 }
      )
    }

    // 插入数据
    const { data, error } = await supabaseAdmin
      .from('history_entries')
      .insert([
        {
          title: title || null,
          description: description || null,
          content: content || null,
          image_url: image_url || null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creating entry:', error)
      return NextResponse.json(
        { error: 'Failed to create entry' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, message: 'Entry created successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 6. app/api/entries/[id]/route.ts

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyDeleteKey } from '@/lib/crypto'

export const runtime = 'edge'

// GET: 获取单个历史记录
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data, error } = await supabaseAdmin
      .from('history_entries')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching entry:', error)
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE: 删除历史记录
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { key } = body

    // 验证密钥
    if (!key || !verifyDeleteKey(key)) {
      return NextResponse.json(
        { error: 'Invalid delete key' },
        { status: 401 }
      )
    }

    // 删除数据
    const { error } = await supabaseAdmin
      .from('history_entries')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting entry:', error)
      return NextResponse.json(
        { error: 'Failed to delete entry' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Entry deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### 7. app/page.tsx (主页)

完整代码见项目文件，主要功能：
- 显示所有历史记录卡片
- 背景图片渐变效果
- 响应式布局
- 卡片包含标题、介绍、时间戳

### 8. app/create/page.tsx (创建页面)

完整代码见项目文件，主要功能：
- 表单输入（标题、介绍、内容、图片链接）
- 上传密钥验证
- 创建成功后自动跳转

### 9. app/entry/[id]/page.tsx (详情页面)

完整代码见项目文件，主要功能：
- 显示单个历史记录详情
- 删除功能（需要删除密钥）
- 支持 HTML 内容渲染

## 样式文件

所有样式文件使用 CSS Modules，位于对应的 `page.module.css` 文件中。

## 环境变量

需要在 `.env.local` 文件中配置：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 密钥

- **上传密钥**: `ssfz2027n15662768895`
- **删除密钥**: `ssfz2027371920029173`

## 数据库表结构

需要在 Supabase 中创建 `history_entries` 表，详见 `SUPABASE_SETUP.md`。

