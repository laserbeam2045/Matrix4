const config = useRuntimeConfig()
const API_PATH = config.public.API_PATH
const endpoint = `${API_PATH}/quizzes/update/press.php`

/**
 * リクエストに必要なパラメータ
 */
export interface Arguments {
  id: number
  push_point: number
}

/**
 * APIから取得されるデータ型
*/
export type Response = {
  result: 0 | 1
}

export default defineEventHandler(async (event) => {
  try {
    const id = encodeURI(getQuery(event).id as string)
    const push_point = encodeURI(getQuery(event).push_point as string)
    const query = `?id=${id}&push_point=${push_point}`
    const response = await $fetch(endpoint + query)

    return JSON.parse(response as string) as Response
  } catch (err) {
    console.log(err)
    return { result: 1 }
  }
})