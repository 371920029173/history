import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'edge'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  const debug: Record<string, unknown> = {
    env: {
      hasUrl: Boolean(supabaseUrl),
      hasAnonKey: Boolean(anonKey),
      hasServiceKey: Boolean(serviceKey),
      urlPreview: supabaseUrl ? `${supabaseUrl.slice(0, 24)}...` : 'missing',
      anonKeyPreview: anonKey ? `${anonKey.slice(0, 6)}...` : 'missing',
      serviceKeyPreview: serviceKey ? `${serviceKey.slice(0, 6)}...` : 'missing',
    },
  }

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      {
        ...debug,
        error: 'Missing Supabase configuration',
      },
      { status: 500 }
    )
  }

  let supabase
  try {
    supabase = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    })
  } catch (error) {
    debug.clientInitError = error instanceof Error ? error.message : String(error)
    return NextResponse.json(debug, { status: 500 })
  }

  try {
    const { data, error } = await supabase
      .from('history_entries')
      .select('id, created_at')
      .limit(5)

    if (error) {
      debug.queryError = error.message
      debug.queryCode = (error as any).code
      return NextResponse.json(debug, { status: 500 })
    }

    debug.querySample = data
    return NextResponse.json(debug)
  } catch (error) {
    debug.unhandledError = error instanceof Error ? error.message : String(error)
    return NextResponse.json(debug, { status: 500 })
  }
}
