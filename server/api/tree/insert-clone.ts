import { createClient } from '@supabase/supabase-js'

/**
 * リクエストに必要なパラメータ
 */
export interface InsertCloneArguments {
  id: string
}

/**
 * APIから取得されるデータ型
*/
export type InsertCloneResponse = {
  id: string | null
}

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    console.log('=== CLONE NODE DEBUG ===')
    
    const supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )

    const id = getQuery(event).id as string
    console.log('Cloning node ID:', id)
    
    // Call PostgreSQL function to clone entire subtree (node + all descendants)
    const { data, error } = await supabase.rpc('clone_subtree_simple', {
      source_id: id,
      target_parent_id: 'SiEBuCsBGkm/UUUe' // Default parent for clones
    })

    console.log('Clone response:', { data, error })

    if (error) {
      console.error('Clone error details:', error)
      throw error
    }

    return {
      id: data
    } as InsertCloneResponse

  } catch (err) {
    console.error('Node cloning error:', err)
    return { id: null }
  }
})