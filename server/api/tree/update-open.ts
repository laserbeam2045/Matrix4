import { API_PATH } from '../../db'

const endpoint = `${API_PATH}/sets/update/opened.php`

/**
 * リクエストに必要なパラメータ
 */
export type UpdateOpenArguments = {
  id: string
}

/**
 * APIから取得されるデータ型
*/
export type UpdateOpenResponse = {
  result: 0 | 1
}

export default defineEventHandler(async (event) => {
  try {
    const id = encodeURI(getQuery(event).id as string)
    const query = `?id=${id}`
    const response = await $fetch(endpoint + query)
    
    return JSON.parse(response as string) as UpdateOpenResponse
  } catch (err) {
    console.log(err)
    
    return { result: 1 }
  }
})