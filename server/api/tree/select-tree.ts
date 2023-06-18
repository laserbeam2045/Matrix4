import type { SetResponse } from '@/composables/useTree'
import { API_PATH } from '../../db'

const endpoint = `${API_PATH}/sets/select/tree.php`

/**
 * リクエストに必要なパラメータ
 */
export interface SelectTreeArguments {
  id: string
}

/**
 * APIから取得されるデータ型
*/
export type SelectTreeResponse = {
  result: SetResponse[] | null
}

export default defineEventHandler(async (event) => {
  try {
    const id = encodeURI(getQuery(event).id as string)
    const query = `?id=${id}`
    const response = await $fetch(endpoint + query)

    return JSON.parse(response as string) as SelectTreeResponse
  } catch (err) {
    console.log(err)

    return { result: null }
  }
})
