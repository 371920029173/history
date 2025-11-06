import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase'

export const runtime = 'edge'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY

    const supabaseAdmin = getSupabaseAdmin()
    const testQuery = await supabaseAdmin
      .from('history_entries')
      .select('id')
      .limit(1)

    return NextResponse.json({
      success: true,
      config: {
        hasUrl: !!supabaseUrl,
        hasAnonKey,
        hasServiceKey,
        url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'missing',
      },
      query: {
        error: testQuery.error?.message || null,
        dataCount: testQuery.data?.length || 0,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

