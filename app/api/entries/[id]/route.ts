import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const DELETE_KEY = 'ssfz2027371920029173'

function verifyDeleteKey(inputKey: string): boolean {
  if (!inputKey || typeof inputKey !== 'string') return false
  
  const key = inputKey.trim()
  if (key.length !== DELETE_KEY.length) return false
  
  const parts = DELETE_KEY.split('')
  const inputParts = key.split('')
  
  if (parts.length !== inputParts.length) return false
  
  for (let i = 0; i < parts.length; i++) {
    if (parts[i] !== inputParts[i]) return false
  }
  
  return true
}

async function getSupabaseAdmin() {
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      return null
    }

    return createClient(url, key.trim(), {
      global: {
        fetch: fetch,
      },
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

// GET: 获取单个历史记录
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabaseAdmin = await getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service unavailable', code: 'D000' },
        { status: 503 }
      )
    }

    const { id } = await params
    const { data, error } = await supabaseAdmin
      .from('history_entries')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Entry not found', code: 'D005', details: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal server error', code: 'D007', details: errorMessage },
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
    const supabaseAdmin = await getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service unavailable', code: 'D000' },
        { status: 503 }
      )
    }
    
    const { id } = await params
    
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body', code: 'D001' },
        { status: 400 }
      )
    }
    
    const { key } = body

    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request format', code: 'D002' },
        { status: 400 }
      )
    }

    if (!verifyDeleteKey(key)) {
      return NextResponse.json(
        { error: 'Authentication failed', code: 'D003' },
        { status: 401 }
      )
    }

    let deleteResult
    try {
      deleteResult = await supabaseAdmin
        .from('history_entries')
        .delete()
        .eq('id', id)
    } catch (dbError) {
      return NextResponse.json(
        { error: 'Database operation failed', code: 'D004', details: dbError instanceof Error ? dbError.message : 'Unknown error' },
        { status: 500 }
      )
    }

    const { error } = deleteResult

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete entry', code: 'D006', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Entry deleted successfully'
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal server error', code: 'D008', details: errorMessage },
      { status: 500 }
    )
  }
}

