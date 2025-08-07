import { createClient } from '@supabase/supabase-js'
import type { SetResponse } from '@/composables/useTree'

/**
 * リクエストに必要なパラメータ
 */
export interface SelectNodeArguments {
  id: string
}

/**
 * APIから取得されるデータ型
*/
export type SelectNodeResponse = {
  result: SetResponse | null
}

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )

    const id = getQuery(event).id as string
    
    // Use PostgreSQL function to handle complex single node query
    const { data, error } = await supabase.rpc('select_node_by_id', {
      target_id: id
    })

    if (error) {
      throw error
    }

    return {
      result: data?.[0] || null
    } as SelectNodeResponse

  } catch (err) {
    console.error('Node selection error:', err)
    return { result: null }
  }
})