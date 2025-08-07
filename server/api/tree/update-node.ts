import { createClient } from '@supabase/supabase-js'

/**
 * リクエストに必要なパラメータ
 */
export type UpdateNodeArguments = {
  id: string
  txt: string
  text: string
  link: string
  opened: number
  isGroup: number
}

/**
 * APIから取得されるデータ型
*/
export type UpdateNodeResponse = {
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
    const txt = getQuery(event).txt as string
    const text = getQuery(event).text as string
    const link = getQuery(event).link as string
    const opened = parseInt(getQuery(event).opened as string)
    const isGroup = parseInt(getQuery(event).isGroup as string)
    
    // Convert numbers to booleans
    const openedBool = opened === 1
    const isGroupBool = isGroup === 1

    // Update node properties
    const { error: updateError } = await supabase
      .from('sets')
      .update({
        txt,
        text,
        link,
        opened: openedBool,
        isGroup: isGroupBool
      })
      .eq('id', id)

    if (updateError) {
      throw updateError
    }

    // Call update_ancestors function (equivalent to CALL updateAncestors)
    const { error: ancestorsError } = await supabase.rpc('update_ancestors', {
      target_id: id,
      update_type: 4
    })

    if (ancestorsError) {
      throw ancestorsError
    }

    return { result: 0 } as UpdateNodeResponse

  } catch (err) {
    console.error('Node update error:', err)
    return { result: 1 }
  }
})