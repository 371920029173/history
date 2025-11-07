import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

// GET: 获取单个历史记录
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const { id } = await params
    const { data, error } = await supabaseAdmin
      .from('history_entries')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Entry not found', code: 'D003', details: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json({ data, ts: Date.now() })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal server error', code: 'D004', details: errorMessage },
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
    const supabaseAdmin = getSupabaseAdmin()
    const { id } = await params
    const body = await request.json()
    const { key } = body

    if (!key || typeof key !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request format', code: 'D001' },
        { status: 400 }
      )
    }

    if (!verifyDeleteKey(key)) {
      return NextResponse.json(
        { error: 'Authentication failed', code: 'D002' },
        { status: 401 }
      )
    }

    const { error } = await supabaseAdmin
      .from('history_entries')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete entry', code: 'D005', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Entry deleted successfully',
      ts: Date.now()
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal server error', code: 'D006', details: errorMessage },
      { status: 500 }
    )
  }
}

