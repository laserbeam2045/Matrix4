import { API_PATH } from '../../db'

const endpoint = `${API_PATH}/sets/insert/tree.php`

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
    const id = encodeURI(getQuery(event).id as string)
    const query = `?id=${id}`
    const response = await $fetch(endpoint + query)
    
    return JSON.parse(response as string) as InsertCloneResponse
  } catch (err) {
    console.log(err)
    
    return { id: null }
  }
})