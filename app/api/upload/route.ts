import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

const imagesBucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'history-images'

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

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = await getSupabaseAdmin()
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Service unavailable', code: 'U000' },
        { status: 503 }
      )
    }
    
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await supabaseAdmin.storage
      .from(imagesBucket)
      .upload(path, uint8Array, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json(
        { error: 'Failed to upload file', details: uploadError.message },
        { status: 500 }
      )
    }

    const { data } = supabaseAdmin.storage.from(imagesBucket).getPublicUrl(path)

    if (!data?.publicUrl) {
      return NextResponse.json(
        { error: 'Failed to get public URL' },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: data.publicUrl })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    )
  }
}

