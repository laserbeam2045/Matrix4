import { serverSupabase } from '../../utils/supabase'

/**
 * リクエストに必要なパラメータ
 */
export type UpdateOpenArguments = {
  id: string
  opened: number
}

/**
 * APIから取得されるデータ型
*/
export type UpdateOpenResponse = {
  result: 0 | 1
}

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabase()

    const id = getQuery(event).id as string
    const opened = parseInt(getQuery(event).opened as string)
    const openedBool = opened === 1

    // Update opened state
    const { error: updateError } = await supabase
      .from('sets')
      .update({ opened: openedBool })
      .eq('id', id)

    if (updateError) {
      throw updateError
    }

    // Call update_ancestors function with update_type 1 (opened state change)
    const { error: ancestorsError } = await supabase.rpc('update_ancestors', {
      target_id: id,
      update_type: 1
    })

    if (ancestorsError) {
      throw ancestorsError
    }

    return { result: 0 } as UpdateOpenResponse

  } catch (err) {
    console.error('Update open error:', err)
    return { result: 1 }
  }
})