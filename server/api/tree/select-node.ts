import type { IncomingMessage } from 'http'

import type { SetResponse } from '@/composables/useTree'

import { API_PATH } from '../../db'

/**
 * リクエストに必要なパラメータ
 */
export interface SelectNodeArguments {
  id: string
}

/**
 * APIから取得されるデータ型
*/
export type SelectNodeResponse = {
  result: SetResponse[] | null
}

const endpoint = `${API_PATH}/sets/select/node.php`

export default async (req: IncomingMessage) => {
  try {
    const response: string = await $fetch(endpoint + req.url)
    return JSON.parse(response) as SelectNodeResponse
  } catch (err) {
    console.log(err)
    return { result: null }
  }
}
