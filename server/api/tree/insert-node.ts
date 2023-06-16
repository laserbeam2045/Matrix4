import type { IncomingMessage } from 'http'

import { API_PATH } from '../../db'

/**
 * リクエストに必要なパラメータ
 */
export type InsertNodeArguments = {
  pID: string
  txt: string
  link: string
}

/**
 * APIから取得されるデータ型
*/
export type InsertNodeResponse = {
  id: string | null
}

const endpoint = `${API_PATH}/sets/insert/node.php`

// export default async (req: IncomingMessage) => {
//   try {
//     const response: string = await $fetch(endpoint + req.url)
//     return JSON.parse(response) as InsertNodeResponse
//   } catch (err) {
//     console.log(err)
//     return { id: null }
//   }
// }

export default defineEventHandler(async (event) => {
  try {
    const { pID, txt, link } = getQuery(event)

    const response = await $fetch(`${endpoint}?pID=${pID}&txt=${txt}&link=${link}`)
    return JSON.parse(response as string) as InsertNodeResponse
  } catch (err) {
    console.log(err)
    return { result: 1 }
  }
})