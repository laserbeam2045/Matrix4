import { serverSupabase } from '../../utils/supabase'

/**
 * リクエストに必要なパラメータ
 */
export type UpdateNodeArguments = {
  id: string
  txt: string
  text: string
  link: string
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
    const supabase = serverSupabase()

    const id = getQuery(event).id as string
    const txt = getQuery(event).txt as string
    const text = getQuery(event).text as string
    const link = getQuery(event).link as string
    const isGroup = parseInt(getQuery(event).isGroup as string)

    // Convert number to boolean
    const isGroupBool = isGroup === 1

    // Update node properties (opened is NOT updated here - it's managed by update-open API)
    const { error: updateError } = await supabase
      .from('sets')
      .update({
        txt,
        text,
        link,
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