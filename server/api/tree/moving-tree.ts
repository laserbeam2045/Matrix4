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

// export default async (req: IncomingMessage) => {
//   try {
//     const response: string = await $fetch(endpoint + req.url)
//     return JSON.parse(response) as MovingTreeResponse
//   } catch (err) {
//     console.log(err)
//     return { result: 2 }
//   }
// }

export default defineEventHandler(async (event) => {
  try {
    const { cID, pID, idx } = getQuery(event)

    const response = await $fetch(`${endpoint}?cID=${cID}&pID=${pID}&idx=${idx}`)
    return JSON.parse(response as string) as MovingTreeResponse
  } catch (err) {
    console.log(err)
    return { result: 2 }
  }
})