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

