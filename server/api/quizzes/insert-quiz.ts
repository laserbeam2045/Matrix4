import type { IncomingMessage } from 'http'

import { API_PATH } from '../../db'

/**
 * リクエストに必要なパラメータ
 */
export interface Arguments {
  id: string
  question: string
  answer: string
  reading: string
  player_id: string
  corrected_num: string
  wronged_num: string
  answered_num: string
  like_num: string
  is_history: string
}

/**
 * APIから取得されるデータ型
*/
export type Response = {
  result: string
}

const endpoint = `${API_PATH}/quizzes/insert/quiz3.php`

export default async (req: IncomingMessage) => {
  try {
    const response: string = await $fetch(endpoint + req.url)
    return JSON.parse(response) as Response
  } catch (err) {
    console.log(err)
    return { result: '1' }
  }
}
