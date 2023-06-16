import type { IncomingMessage } from 'http'

import { API_PATH } from '../../db'

/**
 * リクエストに必要なパラメータ
 */
export interface InsertCloneArguments {
  id: string
}

/**
 * APIから取得されるデータ型
*/
export type InsertCloneResponse = {
  id: string | null
}

const endpoint = `${API_PATH}/sets/insert/tree.php`

// export default async (req: IncomingMessage) => {
//   try {
//     const response: string = await $fetch(endpoint + req.url)
//     return JSON.parse(response) as InsertCloneResponse
//   } catch (err) {
//     console.log(err)
//     return { id: null }
//   }
// }

export default defineEventHandler(async (event) => {
  try {
    const id = getQuery(event).id

    const response = await $fetch(`${endpoint}?id=${id}`)
    return JSON.parse(response as string) as InsertCloneResponse
  } catch (err) {
    console.log(err)
    return { result: null }
  }
})