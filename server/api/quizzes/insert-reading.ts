const config = useRuntimeConfig()
const API_PATH = config.public.API_PATH
const endpoint = `${API_PATH}/quizzes/insert/reading.php`

/**
 * リクエストに必要なパラメータ
 */
export interface Arguments {
  quiz_id: string
  order_num: string
  correct_char: string
  wrong_char1: string
  wrong_char2: string
  wrong_char3: string
}

/**
 * APIから取得されるデータ型
*/
export type Response = {
  result: string
}

export default defineEventHandler(async (event) => {
  try {
    const quiz_id = encodeURIComponent(getQuery(event).quiz_id as string)
    const order_num = encodeURIComponent(getQuery(event).order_num as string)
    const correct_char = encodeURIComponent(getQuery(event).correct_char as string)
    const wrong_char1 = encodeURIComponent(getQuery(event).wrong_char1 as string)
    const wrong_char2 = encodeURIComponent(getQuery(event).wrong_char2 as string)
    const wrong_char3 = encodeURIComponent(getQuery(event).wrong_char3 as string)
    const query = `?quiz_id=${quiz_id}&order_num=${order_num}&correct_char=${correct_char}&wrong_char1=${wrong_char1}&wrong_char2=${wrong_char2}&wrong_char3=${wrong_char3}`
    const response = await $fetch(endpoint + query)

    return JSON.parse(response as string) as Response
  } catch (err) {
    console.log(err)
    return { result: '1' }
  }
})
