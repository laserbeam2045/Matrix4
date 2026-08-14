import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/**
 * サーバー専用のSupabaseクライアントを返す
 * service_roleキーで接続するため、RLS有効のテーブルにもアクセスできる
 * （キーはruntimeConfigの非public領域にあり、クライアントへは露出しない）
 */
export const serverSupabase = (): SupabaseClient => {
  if (!client) {
    const config = useRuntimeConfig()
    const url = config.supabaseUrl as string
    const key = config.supabaseServiceKey as string

    if (!url || !key) {
      throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY が設定されていません')
    }

    client = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }

  return client
}
