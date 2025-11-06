import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({
        success: false,
        error: 'Supabase环境变量未配置',
        config: {
          hasUrl: !!supabaseUrl,
          hasAnonKey,
          hasServiceKey,
        },
      }, { status: 500 })
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey.trim(), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    })

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

