import type { CompleteQuizData } from '@/composables/useQuiz'

const config = useRuntimeConfig()
const API_PATH = config.public.API_PATH
const endpoint = `${API_PATH}/quizzes/select/search.php`

/**
 * リクエストに必要なパラメータ
 */
export interface Arguments {
  word: string
  min: number
  max: number
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
    const word = encodeURI(getQuery(event).word as string)
    const min = encodeURI(getQuery(event).min as string)
    const max = encodeURI(getQuery(event).max as string)
    const query = `?word=${word}&min=${min}&max=${max}`
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