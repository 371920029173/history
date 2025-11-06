import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyUploadKey } from '@/lib/crypto'

export const runtime = 'edge'

// GET: 获取所有历史记录
export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('history_entries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch entries', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    )
  }
}

// POST: 创建新的历史记录
export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { key, title, description, content, image_url } = body

    if (!key || !verifyUploadKey(key)) {
      return NextResponse.json(
        { error: 'Invalid upload key' },
        { status: 401 }
      )
    }

    if (!title && !description && !content && !image_url) {
      return NextResponse.json(
        { error: 'At least one field (title, description, content, or image_url) is required' },
        { status: 400 }
      )
    }

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
      return NextResponse.json(
        { error: 'Failed to create entry', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, message: 'Entry created successfully' })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    )
  }
}

