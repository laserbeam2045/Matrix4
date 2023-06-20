import type { IncomingMessage } from 'http'

const config = useRuntimeConfig()
const API_PATH = config.public.API_PATH
const endpoint = `${API_PATH}/quizzes/delete/quiz.php`

/**
 * リクエストに必要なパラメータ
 */
export interface Arguments {
  id: number
}

/**
 * APIから取得されるデータ型
*/
export type Response = {
  result: 0 | 1
}

export default defineEventHandler(async (event) => {
  try {
    const id = encodeURIComponent(getQuery(event).id as string)
    const query = `?id=${id}`
    const response = await $fetch(endpoint + query)

    return JSON.parse(response as string) as Response
  } catch (err) {
    console.log(err)
    return { result: 1 }
  }
})
