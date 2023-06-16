// import type { IncomingMessage, ServerResponse } from 'http'

import url from 'node:url'

import type { SetResponse } from '@/composables/useTree'

import { API_PATH } from '../../db'

/**
 * リクエストに必要なパラメータ
 */
export interface SelectTreeArguments {
  id: string
}

/**
 * APIから取得されるデータ型
*/
export type SelectTreeResponse = {
  result: SetResponse[] | null
}

const endpoint = `${API_PATH}/sets/select/tree.php`

export default defineEventHandler(async (event) => {
  try {
    const id = getQuery(event).id

    // const response = await useFetch(endpoint + `?id="${id}"`)
    const response = await $fetch(`${endpoint}?id=${id}`)
    return JSON.parse(response as string) as SelectTreeResponse
  } catch (err) {
    console.log(err)
    return { result: null }
  }
})
