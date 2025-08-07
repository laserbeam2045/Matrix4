import { createClient } from '@supabase/supabase-js'

/**
 * リクエストに必要なパラメータ
 */
export type InsertNodeArguments = {
  pID: string
  txt: string
  text: string
  link: string
}

/**
 * APIから取得されるデータ型
*/
export type InsertNodeResponse = {
  id: string | null
}

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )

    const pID = getQuery(event).pID as string
    const txt = getQuery(event).txt as string
    const text = getQuery(event).text as string
    const link = getQuery(event).link as string
    
    // Call PostgreSQL function to insert node with proper space allocation
    const { data, error } = await supabase.rpc('insert_node_with_space', {
      parent_id: pID,
      txt,
      text,
      link
    })

    if (error) {
      throw error
    }

    return {
      id: data
    } as InsertNodeResponse

  } catch (err) {
    console.error('Node insertion error:', err)
    return { id: null }
  }
})