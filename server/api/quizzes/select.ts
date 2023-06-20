import { CompleteQuizData } from '@/composables/useQuiz'

const config = useRuntimeConfig()
const API_PATH = config.public.API_PATH
const endpoint = `${API_PATH}/quizzes/select/select.php`

/**
 * リクエストに必要なパラメータ
 */
export interface Arguments {
  id: string
}

/**
 * APIから取得されるデータ型
*/
export type Response = {
  status: 'ok' | 'ng'
  total: number
  items: CompleteQuizData[]
}

export default defineEventHandler(async (event) => {
  try {
    const id = encodeURIComponent(getQuery(event).id as string)
    const query = `?id=${id}`
    const response = await $fetch(endpoint + query)

    console.log(endpoint + query)
    console.log(endpoint + query)
    console.log(endpoint + query)
    console.log(endpoint + query)

    return JSON.parse(response as string) as Response
  } catch (err) {
    console.log(err)
    return {
      status: 'ng',
      total: 0,
      items: [],
    } as Response
  }
})