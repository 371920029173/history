import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
export const imagesBucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'history-images'

// 客户端 Supabase 实例（用于读取）
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 服务端 Supabase 实例（用于写入和删除，如果有服务角色密钥）
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : supabase

