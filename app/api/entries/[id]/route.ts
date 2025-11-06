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

