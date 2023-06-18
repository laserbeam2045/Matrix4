import type { IncomingMessage } from 'http'

const config = useRuntimeConfig()
const API_PATH = config.public.API_PATH
const endpoint = `${API_PATH}/quizzes/insert/quiz.php`

/**
 * リクエストに必要なパラメータ
 */
export interface Arguments {
  question: string
  answer1: string
  answer2: string
  correctAnswerRate: number
}

/**
 * APIから取得されるデータ型
*/
export type Response = {
  result: string
}

export default defineEventHandler(async (event) => {
  try {
    const question = encodeURI(getQuery(event).question as string)
    const answer1 = encodeURI(getQuery(event).answer1 as string)
    const answer2 = encodeURI(getQuery(event).answer2 as string)
    const correctAnswerRate = encodeURI(getQuery(event).correctAnswerRate as string)
    const query = `?question=${question}&answer1=${answer1}&answer2=${answer2}&correctAnswerRate=${correctAnswerRate}`
    const response = await $fetch(endpoint + query)

    return JSON.parse(response as string) as Response
  } catch (err) {
    console.log(err)
    return { result: '1' }
  }
})