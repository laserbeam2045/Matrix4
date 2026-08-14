import { serverSupabase } from '../../utils/supabase'

/**
 * リクエストに必要なパラメータ
 */
export interface SelectUpdatedArguments {
  id: string
}

/**
 * APIから取得されるデータ型
*/
export type SelectUpdatedResponse = {
  result: {
    updatedAt: string
    updatedType: number
  } | null
}

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabase()

    const id = getQuery(event).id as string
    
    // Simple SELECT for update timestamp and type
    const { data, error } = await supabase
      .from('sets')
      .select('updatedAt, updatedType')
      .eq('id', id)
      .single()

    if (error) {
      throw error
    }

    return {
      result: data
    } as SelectUpdatedResponse

  } catch (err) {
    console.error('Select updated error:', err)
    return { result: null }
  }
})