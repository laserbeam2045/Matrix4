import type { IncomingMessage } from 'http'

import { API_PATH } from '../../db'

/**
 * リクエストに必要なパラメータ
 */
export interface SelectUpdatedArguments {
  id: string
}

/**
 * APIから取得されるデータ型
*/
export type SelectUpdatedResponse = {
  result: {
    updatedAt: string
  } | null
}

const endpoint = `${API_PATH}/sets/select/updated.php`

export default async (req: IncomingMessage) => {
  try {
    const response: string = await $fetch(endpoint + req.url)
    return JSON.parse(response) as SelectUpdatedResponse
  } catch (err) {
    console.log(err)
    return { result: null }
  }
}
