import { createClient } from '@supabase/supabase-js'

/**
 * リクエストに必要なパラメータ
 */
export type MovingTreeArguments = {
  cID: string
  pID: string
  idx: number
}

/**
 * APIから取得されるデータ型
*/
export type MovingTreeResponse = {
  result: 0 | 1 | 2
}

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    console.log('=== MOVE TREE DEBUG ===')
    
    const supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )

    const cID = getQuery(event).cID as string
    const pID = getQuery(event).pID as string
    const idx = parseInt(getQuery(event).idx as string)
    
    console.log('Moving tree:', { cID, pID, idx })
    
    // Call PostgreSQL function to move tree (same as node - moves subtree)
    const { data, error } = await supabase.rpc('move_node_api', {
      child_id: cID,
      parent_id: pID,
      insert_idx: idx
    })

    console.log('Move tree response:', { data, error })

    if (error) {
      console.error('Move tree error:', error)
      return { result: 2 }
    }

    return { result: data } as MovingTreeResponse
  } catch (err) {
    console.error('Tree moving error:', err)
    return { result: 2 }
  }
})