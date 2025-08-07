import { createClient } from '@supabase/supabase-js'
import type { SetResponse } from '@/composables/useTree'

/**
 * リクエストに必要なパラメータ
 */
export interface SelectTreeArguments {
  id: string
}

/**
 * APIから取得されるデータ型
*/
export type SelectTreeResponse = {
  result: SetResponse[] | null
}

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )

    const id = getQuery(event).id as string
    
    // Use PostgreSQL function to handle complex nested intervals query
    const { data, error } = await supabase.rpc('select_tree_by_id', {
      target_id: id
    })

    if (error) {
      throw error
    }

    return {
      result: data
    } as SelectTreeResponse

  } catch (err) {
    console.error('Tree selection error:', err)
    return { result: null }
  }
})
