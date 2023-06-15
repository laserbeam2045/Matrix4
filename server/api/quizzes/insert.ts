import type { IncomingMessage } from 'http'

import { API_PATH } from '../../db'

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

const endpoint = `${API_PATH}/quizzes/insert/quiz.php`

export default async (req: IncomingMessage) => {
  try {
    const response: string = await $fetch(endpoint + req.url)
    return JSON.parse(response) as Response
  } catch (err) {
    console.log(err)
    return { result: '1' }
  }
}
