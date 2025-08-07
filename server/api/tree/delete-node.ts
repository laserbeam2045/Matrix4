import { createClient } from '@supabase/supabase-js'

/**
 * リクエストに必要なパラメータ
 */
export type DeleteNodeArguments = {
  id: string
}

/**
 * APIから取得されるデータ型
*/
export type DeleteNodeResponse = {
  result: 0 | 1
}

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )

    const id = getQuery(event).id as string
    
    // Update ancestors first (equivalent to CALL updateAncestors with type 5 for delete)
    const { error: ancestorsError } = await supabase.rpc('update_ancestors', {
      target_id: id,
      update_type: 5
    })

    if (ancestorsError) {
      throw ancestorsError
    }

    // Delete the node
    const { error: deleteError } = await supabase
      .from('sets')
      .delete()
      .eq('id', id)

    if (deleteError) {
      throw deleteError
    }

    return { result: 0 } as DeleteNodeResponse

  } catch (err) {
    console.error('Node deletion error:', err)
    return { result: 1 }
  }
})