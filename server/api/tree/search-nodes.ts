import type { SetResponse } from '@/composables/useTree'
import { API_PATH } from '../../db'

const endpoint = `${API_PATH}/sets/select/search.php`

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
  result: SetResponse[] | null
}

export default defineEventHandler(async (event) => {
  try {
    const word = encodeURI(getQuery(event).word as string)
    const query = `?word=${word}`
    const response = await $fetch(endpoint + query)
    
    return JSON.parse(response as string) as SearchNodesResponse
  } catch (err) {
    console.log(err)

    return { result: null }
  }
})
