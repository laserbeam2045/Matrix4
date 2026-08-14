import { serverSupabase } from '../../utils/supabase'

/**
 * リクエストに必要なパラメータ
 */
export interface SearchNodesArguments {
  word: string
}

/**
 * APIから取得されるデータ型
*/
export type SearchNodesResponse = {
  result: {
    id: string
    txt: string
    text: string
    parent: string
    parentTxt: string
  }[] | null
}

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabase()

    const word = getQuery(event).word as string
    
    // Use PostgreSQL function for search with parent information
    const { data, error } = await supabase.rpc('search_nodes_by_text', {
      search_word: word
    })

    if (error) {
      throw error
    }

    return {
      result: data || []
    } as SearchNodesResponse

  } catch (err) {
    console.error('Node search error:', err)
    return { result: null }
  }
})
