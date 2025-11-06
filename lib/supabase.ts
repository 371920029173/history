import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
export const imagesBucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'history-images'

// Edge Runtime 兼容：动态创建 Supabase 客户端
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase Admin环境变量未配置')
  }

  const cleanKey = serviceRoleKey.trim().replace(/\s+/g, '')

  return createClient(url, cleanKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })
}

// 客户端 Supabase 实例（用于读取）
let supabase: ReturnType<typeof createClient> | null = null
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}
export { supabase }

// 服务端 Supabase 实例（用于写入和删除，如果有服务角色密钥）
let supabaseAdmin: ReturnType<typeof createClient> | null = null
try {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (supabaseUrl && serviceRoleKey) {
    const cleanKey = serviceRoleKey.trim().replace(/\s+/g, '')
    supabaseAdmin = createClient(supabaseUrl, cleanKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
} catch (error) {
  console.warn('Supabase Admin 初始化失败（可能是 Edge Runtime）:', error)
}

export { supabaseAdmin }

