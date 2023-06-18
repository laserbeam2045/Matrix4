// import { API_PATH } from '../../db'
const config = useRuntimeConfig()
const API_PATH = config.public.API_PATH

const endpoint = `${API_PATH}/sets/move/tree.php`

/**
 * リクエストに必要なパラメータ
 */
export type MovingTreeArguments = {
  cID: string
  pID: string
  idx: number
}

/**
 * APIから取得されるデータ型
*/
export type MovingTreeResponse = {
  result: 0 | 1 | 2
}

export default defineEventHandler(async (event) => {
  try {
    const cID = encodeURI(getQuery(event).cID as string)
    const pID = encodeURI(getQuery(event).pID as string)
    const idx = encodeURI(getQuery(event).idx as string)
    const query = `?cID=${cID}&pID=${pID}&idx=${idx}`
    const response = await $fetch(endpoint + query)

    return JSON.parse(response as string) as MovingTreeResponse
  } catch (err) {
    console.log(err)
    return { result: 2 }
  }
})