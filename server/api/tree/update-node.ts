import type { IncomingMessage } from 'http'

import { API_PATH } from '../../db'

/**
 * リクエストに必要なパラメータ
 */
export type UpdateNodeArguments = {
  id: string
  txt: string
  link: string
  opened: number
  isGroup: number
}

/**
 * APIから取得されるデータ型
*/
export type UpdateNodeResponse = {
  result: 0 | 1
}

const endpoint = `${API_PATH}/sets/update/node.php`

// export default async (req: IncomingMessage) => {
//   try {
//     const response: string = await $fetch(endpoint + req.url)
//     return JSON.parse(response) as UpdateNodeResponse
//   } catch (err) {
//     console.log(err)
//     return { result: 1 }
//   }
// }
export default defineEventHandler(async (event) => {
  try {
    const { id, txt, link, opened, isGroup } = getQuery(event)

    const response = await $fetch(`${endpoint}?id=${id}&txt=${txt}&link=${link}&opened=${opened}&isGroup=${isGroup}`)
    return JSON.parse(response as string) as UpdateNodeResponse
  } catch (err) {
    console.log(err)
    return { result: 1 }
  }
})