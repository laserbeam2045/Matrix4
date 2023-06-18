import type { SetResponse } from '@/composables/useTree'
// import { API_PATH } from '../../db'
const config = useRuntimeConfig()
const API_PATH = config.public.API_PATH

const endpoint = `${API_PATH}/sets/select/node.php`

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

export default defineEventHandler(async (event) => {
  try {
    const id = encodeURI(getQuery(event).id as string)
    const query = `?id=${id}`
    const response = await $fetch(endpoint + query)
    
    return JSON.parse(response as string) as SelectNodeResponse
  } catch (err) {
    console.log(err)
    
    return { result: null }
  }
})