import type { IncomingMessage } from 'http'

import { API_PATH } from '../../db'

/**
 * リクエストに必要なパラメータ
 */
export interface Arguments {
  quiz_id: string
  order_num: string
  correct_char: string
  wrong_char1: string
  wrong_char2: string
  wrong_char3: string
}

/**
 * APIから取得されるデータ型
*/
export type Response = {
  result: string
}

const endpoint = `${API_PATH}/quizzes/insert/reading.php`

export default async (req: IncomingMessage) => {
  try {
    const response: string = await $fetch(endpoint + req.url)
    return JSON.parse(response) as Response
  } catch (err) {
    console.log(err)
    return { result: '1' }
  }
}
