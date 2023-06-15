import type { IncomingMessage } from 'http'

import { API_PATH } from '../../db'

/**
 * リクエストに必要なパラメータ
 */
export type UpdateOpenArguments = {
  id: string
}

/**
 * APIから取得されるデータ型
*/
export type UpdateOpenResponse = {
  result: 0 | 1
}

const endpoint = `${API_PATH}/sets/update/opened.php`

export default async (req: IncomingMessage) => {
  try {
    const response: string = await $fetch(endpoint + req.url)
    return JSON.parse(response) as UpdateOpenResponse
  } catch (err) {
    console.log(err)
    return { result: 1 }
  }
}
