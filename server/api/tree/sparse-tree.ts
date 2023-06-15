import type { IncomingMessage } from 'http'

import { API_PATH } from '../../db'

/**
 * リクエストに必要なパラメータ
 */
export interface SparseTreeArguments {
  id?: string
}

/**
 * APIから取得されるデータ型
*/
export type SparseTreeResponse = {
  result: 0 | 1
}

const endpoint = `${API_PATH}/sets/update/sparse.php`

export default async (req: IncomingMessage) => {
  try {
    const response: string = await $fetch(endpoint + req.url)
    return JSON.parse(response) as SparseTreeResponse
  } catch (err) {
    console.log(err)
    return { result: 1 }
  }
}
