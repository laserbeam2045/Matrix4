import { createClient } from '@supabase/supabase-js'

/**
 * リクエストに必要なパラメータ
 */
export type DeleteTreeArguments = {
  id: string
}

/**
 * APIから取得されるデータ型
*/
export type DeleteTreeResponse = {
  result: 0 | 1
}

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    console.log('=== DELETE SUBTREE DEBUG ===')
    
    const supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey
    )

    const id = getQuery(event).id as string
    console.log('Deleting subtree for node ID:', id)
    
    // First preview what will be deleted (for debugging)
    const { data: previewData, error: previewError } = await supabase.rpc('preview_subtree_delete', {
      target_id: id
    })
    
    if (!previewError && previewData) {
      console.log('Nodes that will be deleted:', previewData.length)
      previewData.forEach((node: any) => {
        console.log(`- ${node.txt} (${node.id})`)
      })
    }
    
    // Delete the entire subtree
    const { data, error } = await supabase.rpc('delete_subtree_safe', {
      target_id: id
    })

    console.log('Delete subtree response:', { data, error })

    if (error) {
      console.error('Delete subtree error:', error)
      throw error
    }

    console.log(`Successfully deleted ${data} nodes from subtree`)
    
    return { result: 0 } as DeleteTreeResponse

  } catch (err) {
    console.error('Subtree deletion error:', err)
    return { result: 1 }
  }
})