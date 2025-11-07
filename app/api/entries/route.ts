import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

const UPLOAD_KEY = 'ssfz2027n15662768895'

function verifyUploadKey(inputKey: string, timestamp?: number): boolean {
  if (!inputKey || typeof inputKey !== 'string') return false
  
  const key = inputKey.trim()
  if (key.length !== UPLOAD_KEY.length) return false
  
  const parts = UPLOAD_KEY.split('')
  const inputParts = key.split('')
  
  if (parts.length !== inputParts.length) return false
  
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] !== inputParts[i]) return false
  }
  
  if (timestamp) {
    const now = Date.now()
    const diff = Math.abs(now - timestamp)
    if (diff > 300000) return false
  }
  
  return true
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Supabase环境变量未配置')
  }

  return createClient(url, key.trim(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })
}

// GET: 获取所有历史记录
export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('history_entries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch entries', code: 'E003', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, ts: Date.now() })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal server error', code: 'E004', details: errorMessage },
      { status: 500 }
    )
  }
}

// POST: 创建新的历史记录
export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const body = await request.json()
    const { key, title, description, content, image_url, ts } = body

    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request format', code: 'E001' },
        { status: 400 }
      )
    }

    if (!verifyUploadKey(key, ts)) {
      return NextResponse.json(
        { error: 'Authentication failed', code: 'E002' },
        { status: 401 }
      )
    }

    if (!title && !description && !content && !image_url) {
      return NextResponse.json(
        { error: 'At least one field is required', code: 'E005' },
        { status: 400 }
      )
    }

    if (content && typeof content === 'string' && content.length > 100000) {
      return NextResponse.json(
        { error: 'Content too long', code: 'E006' },
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
        { error: 'Failed to create entry', code: 'E007', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data, 
      message: 'Entry created successfully',
      ts: Date.now()
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal server error', code: 'E008', details: errorMessage },
      { status: 500 }
    )
  }
}

