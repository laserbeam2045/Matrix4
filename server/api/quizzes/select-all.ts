import { QuizData } from '@/composables/useQuiz'

const config = useRuntimeConfig()
const API_PATH = config.public.API_PATH
const endpoint = `${API_PATH}/quizzes/select/all.php`

/**
 * APIから取得されるデータ型
*/
export type Response = {
  status: 'ok' | 'ng'
  total: number
  items: QuizData[]
}

export default defineEventHandler(async (event) => {
  try {
    const query = ``
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