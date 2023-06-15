import type { IncomingMessage } from 'http'

import { API_PATH } from '../../db'

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

const endpoint = `${API_PATH}/quizzes/update/press.php`

export default async (req: IncomingMessage) => {
  try {
    const response: string = await $fetch(endpoint + req.url)
    return JSON.parse(response) as Response
  } catch (err) {
    console.log(err)
    return { result: 1 }
  }
}
