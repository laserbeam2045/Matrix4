import { API_PATH } from '../../db'

const endpoint = `${API_PATH}/sets/delete/tree.php`

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
    const id = encodeURI(getQuery(event).id as string)
    const query = `?id=${id}`
    const response = await $fetch(endpoint + query)
    
    return JSON.parse(response as string) as DeleteTreeResponse
  } catch (err) {
    console.log(err)
    
    return { result: 1 }
  }
})