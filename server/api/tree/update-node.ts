// import { API_PATH } from '../../db'
const config = useRuntimeConfig()
const API_PATH = config.public.API_PATH

const endpoint = `${API_PATH}/sets/update/node.php`

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

export default defineEventHandler(async (event) => {
  try {
    const id = encodeURIComponent(getQuery(event).id as string)
    const txt = encodeURIComponent(getQuery(event).txt as string)
    const link = encodeURIComponent(getQuery(event).link as string)
    const opened = encodeURIComponent(getQuery(event).opened as string)
    const isGroup = encodeURIComponent(getQuery(event).isGroup as string)
    const query = `?id=${id}&txt=${txt}&link=${link}&opened=${opened}&isGroup=${isGroup}`
    const response = await $fetch(endpoint + query)
    
    return JSON.parse(response as string) as UpdateNodeResponse
  } catch (err) {
    console.log(err)
    
    return { result: 1 }
  }
})