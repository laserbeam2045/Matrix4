import type { IncomingMessage } from 'http'

import { API_PATH } from '../../db'

/**
 * リクエストに必要なパラメータ
 */
export type UpdateGroupArguments = {
  id: string
  isGroup: number
}

/**
 * APIから取得されるデータ型
*/
export type UpdateGroupResponse = {
  result: 0 | 1
}

const endpoint = `${API_PATH}/sets/update/group.php`

export default async (req: IncomingMessage) => {
  try {
    const response: string = await $fetch(endpoint + req.url)
    return JSON.parse(response) as UpdateGroupResponse
  } catch (err) {
    console.log(err)
    return { result: 1 }
  }
}
