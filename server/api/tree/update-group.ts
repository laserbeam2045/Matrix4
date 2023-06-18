// import { API_PATH } from '../../db'
const config = useRuntimeConfig()
const API_PATH = config.public.API_PATH

const endpoint = `${API_PATH}/sets/update/group.php`

/**
 * リクエストに必要なパラメータ
 */
export type UpdateGroupArguments = {
  id: string
  isGroup: number
}

/**
 * APIから取得されるデータ型
*/
export type UpdateGroupResponse = {
  result: 0 | 1
}

export default defineEventHandler(async (event) => {
  try {
    const id = encodeURI(getQuery(event).id as string)
    const isGroup = encodeURI(getQuery(event).isGroup as string)
    const query = `?id=${id}&isGroup=${isGroup}`
    const response = await $fetch(endpoint + query)
    
    return JSON.parse(response as string) as UpdateGroupResponse
  } catch (err) {
    console.log(err)
    
    return { result: 1 }
  }
})