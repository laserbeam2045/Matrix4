// import { API_PATH } from '../../db'
const config = useRuntimeConfig()
const API_PATH = config.public.API_PATH

const endpoint = `${API_PATH}/sets/move/node.php`

/**
 * リクエストに必要なパラメータ
 */
export type MovingNodeArguments = {
  cID: string
  pID: string
  idx: number
}

/**
 * APIから取得されるデータ型
*/
export type MovingNodeResponse = {
  result: 0 | 1 | 2
}

export default defineEventHandler(async (event) => {
  try {
    const cID = encodeURIComponent(getQuery(event).cID as string)
    const pID = encodeURIComponent(getQuery(event).pID as string)
    const idx = encodeURIComponent(getQuery(event).idx as string)
    const query = `?cID=${cID}&pID=${pID}&idx=${idx}`

    console.log(endpoint + query)
    console.log(endpoint + query)
    console.log(endpoint + query)
    console.log(endpoint + query)
    const response = await $fetch(endpoint + query)

    return JSON.parse(response as string) as MovingNodeResponse
  } catch (err) {
    console.log(err)
    
    return { result: 2 }
  }
})