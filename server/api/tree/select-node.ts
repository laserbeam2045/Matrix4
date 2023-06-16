// import type { IncomingMessage } from 'http'

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

export default defineEventHandler(async (event) => {
  try {
    const id = getQuery(event).id

    // const response = await useFetch(endpoint + `?id="${id}"`)
    const response = await $fetch(`${endpoint}?id=${id}`)
    return JSON.parse(response as string) as SelectNodeResponse
  } catch (err) {
    console.log(err)
    return { result: null }
  }
})