// import { API_PATH } from '../../db'
const config = useRuntimeConfig()
const API_PATH = config.public.API_PATH

const endpoint = `${API_PATH}/sets/select/updated.php`

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
    updatedType: number
  } | null
}

// export default async (req: IncomingMessage) => {
//   try {
//     const response: string = await $fetch(endpoint + req.url)
//     return JSON.parse(response) as SelectUpdatedResponse
//   } catch (err) {
//     console.log(err)
//     return { result: null }
//   }
// }
export default defineEventHandler(async (event) => {
  try {
    const id = encodeURIComponent(getQuery(event).id as string)
    const query = `?id=${id}`
    const response = await $fetch(endpoint + query)
    
    return JSON.parse(response as string) as SelectUpdatedResponse
  } catch (err) {
    console.log(err)
    
    return { result: null }
  }
})