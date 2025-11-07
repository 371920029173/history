import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  const debug: Record<string, unknown> = {
    runtime: 'edge',
    timestamp: new Date().toISOString(),
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    debug.env = {
      hasUrl: Boolean(supabaseUrl),
      hasAnonKey: Boolean(anonKey),
      hasServiceKey: Boolean(serviceKey),
      urlPreview: supabaseUrl ? `${supabaseUrl.substring(0, 24)}...` : 'missing',
      anonKeyPreview: anonKey ? `${anonKey.substring(0, 6)}...` : 'missing',
      serviceKeyPreview: serviceKey ? `${serviceKey.substring(0, 6)}...` : 'missing',
    }

    if (!supabaseUrl || !serviceKey) {
      debug.error = 'Missing Supabase configuration'
      return NextResponse.json(debug, { status: 500 })
    }

    // 动态导入 createClient，避免 Edge Runtime 初始化问题
    let createClient
    try {
      const supabaseModule = await import('@supabase/supabase-js')
      createClient = supabaseModule.createClient
    } catch (importError) {
      debug.importError = importError instanceof Error ? importError.message : String(importError)
      return NextResponse.json(debug, { status: 500 })
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
      debug.clientCreated = true
    } catch (error) {
      debug.clientInitError = error instanceof Error ? error.message : String(error)
      debug.clientInitStack = error instanceof Error ? error.stack : undefined
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
        debug.queryDetails = error
        return NextResponse.json(debug, { status: 500 })
      }

      debug.querySuccess = true
      debug.querySample = data
      return NextResponse.json(debug)
    } catch (error) {
      debug.queryException = error instanceof Error ? error.message : String(error)
      debug.queryExceptionStack = error instanceof Error ? error.stack : undefined
      return NextResponse.json(debug, { status: 500 })
    }
  } catch (outerError) {
    debug.fatalError = outerError instanceof Error ? outerError.message : String(outerError)
    debug.fatalStack = outerError instanceof Error ? outerError.stack : undefined
    return NextResponse.json(debug, { status: 500 })
  }
}
