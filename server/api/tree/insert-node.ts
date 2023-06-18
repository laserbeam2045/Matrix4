import { API_PATH } from '../../db'

const endpoint = `${API_PATH}/sets/insert/node.php`

/**
 * リクエストに必要なパラメータ
 */
export type InsertNodeArguments = {
  pID: string
  txt: string
  link: string
}

/**
 * APIから取得されるデータ型
*/
export type InsertNodeResponse = {
  id: string | null
}

export default defineEventHandler(async (event) => {
  try {
    const pID = encodeURI(getQuery(event).pID as string)
    const txt = encodeURI(getQuery(event).txt as string)
    const link = encodeURI(getQuery(event).link as string)
    const query = `?pID=${pID}&txt=${txt}&link=${link}`
    const response = await $fetch(endpoint + query)

    return JSON.parse(response as string) as InsertNodeResponse
  } catch (err) {
    console.log(err)
    
    return { id: null }
  }
})