import type { IncomingMessage } from 'http'

import { API_PATH } from '../../db'

/**
 * リクエストに必要なパラメータ
 */
export type MovingTreeArguments = {
  cID: string
  pID: string
  idx: number
}

/**
 * APIから取得されるデータ型
*/
export type MovingTreeResponse = {
  result: 0 | 1 | 2
}

const endpoint = `${API_PATH}/sets/move/tree.php`

export default async (req: IncomingMessage) => {
  try {
    const response: string = await $fetch(endpoint + req.url)
    return JSON.parse(response) as MovingTreeResponse
  } catch (err) {
    console.log(err)
    return { result: 2 }
  }
}
