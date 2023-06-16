import type { IncomingMessage } from 'http'

import type { SetResponse } from '@/composables/useTree'

import { API_PATH } from '../../db'

/**
 * リクエストに必要なパラメータ
 */
export interface SearchNodesArguments {
  word: string
}

/**
 * APIから取得されるデータ型
*/
export type SearchNodesResponse = {
  result: SetResponse[] | null
}

const endpoint = `${API_PATH}/sets/select/search.php`

// export default async (req: IncomingMessage) => {
//   try {
//     const response: string = await $fetch(endpoint + req.url)
//     return JSON.parse(response) as SearchNodesResponse
//   } catch (err) {
//     console.log(err)
//     return { result: null }
//   }
// }

export default defineEventHandler(async (event) => {
  try {
    const word = getQuery(event).word

    const response = await $fetch(`${endpoint}?word=${word}`)
    return JSON.parse(response as string) as SearchNodesResponse
  } catch (err) {
    console.log(err)
    return { result: null }
  }
})
