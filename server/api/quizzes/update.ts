const config = useRuntimeConfig()
const API_PATH = config.public.API_PATH
const endpoint = `${API_PATH}/quizzes/update/quiz.php`

/**
 * リクエストに必要なパラメータ
 */
export interface Arguments {
  id: number
  question: string
  answer1: string
  answer2: string
  correctAnswerRate: number
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
    const question = encodeURIComponent(getQuery(event).question as string)
    const answer1 = encodeURIComponent(getQuery(event).answer1 as string)
    const answer2 = encodeURIComponent(getQuery(event).answer2 as string)
    const correctAnswerRate = encodeURIComponent(getQuery(event).correctAnswerRate as string)
    const query = `?id=${id}&question=${question}&answer1=${answer1}&answer2=${answer2}&correctAnswerRate=${correctAnswerRate}`
    const response = await $fetch(endpoint + query)

    return JSON.parse(response as string) as Response
  } catch (err) {
    console.log(err)
    return { result: 1 }
  }
})