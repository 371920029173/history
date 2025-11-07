import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

const UPLOAD_KEY = 'ssfz2027n15662768895'

function verifyUploadKey(inputKey: string): boolean {
  if (!inputKey || typeof inputKey !== 'string') return false
  
  const key = inputKey.trim()
  if (key.length !== UPLOAD_KEY.length) return false
  
  const parts = UPLOAD_KEY.split('')
  const inputParts = key.split('')
  
  if (parts.length !== inputParts.length) return false
  
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] !== inputParts[i]) return false
  }
  
  return true
}

function getSupabaseAdmin() {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      return null
    }

    return createClient(url, key.trim(), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    })
  } catch (error) {
    return null
  }
}

// GET: 获取所有历史记录
export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service unavailable', code: 'E000' },
        { status: 503 }
      )
    }
    
    let queryResult
    try {
      queryResult = await supabaseAdmin
        .from('history_entries')
        .select('*')
        .order('created_at', { ascending: false })
    } catch (dbError) {
      return NextResponse.json(
        { error: 'Database query failed', code: 'E003', details: dbError instanceof Error ? dbError.message : 'Unknown error' },
        { status: 500 }
      )
    }

    const { data, error } = queryResult

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch entries', code: 'E004', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal server error', code: 'E009', details: errorMessage },
      { status: 500 }
    )
  }
}

// POST: 创建新的历史记录
export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service unavailable', code: 'E000' },
        { status: 503 }
      )
    }
    
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body', code: 'E001' },
        { status: 400 }
      )
    }
    
    const { key, title, description, content, image_url } = body

    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request format', code: 'E002' },
        { status: 400 }
      )
    }

    if (!verifyUploadKey(key)) {
      return NextResponse.json(
        { error: 'Authentication failed', code: 'E003' },
        { status: 401 }
      )
    }

    if (!title && !description && !content && !image_url) {
      return NextResponse.json(
        { error: 'At least one field is required', code: 'E005' },
        { status: 400 }
      )
    }

    let insertResult
    try {
      insertResult = await supabaseAdmin
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
    } catch (dbError) {
      return NextResponse.json(
        { error: 'Database operation failed', code: 'E006', details: dbError instanceof Error ? dbError.message : 'Unknown error' },
        { status: 500 }
      )
    }

    const { data, error } = insertResult

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create entry', code: 'E007', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data, 
      message: 'Entry created successfully'
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal server error', code: 'E010', details: errorMessage },
      { status: 500 }
    )
  }
}

