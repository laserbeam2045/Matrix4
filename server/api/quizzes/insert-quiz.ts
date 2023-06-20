const config = useRuntimeConfig()
const API_PATH = config.public.API_PATH
const endpoint = `${API_PATH}/quizzes/insert/quiz3.php`

/**
 * リクエストに必要なパラメータ
 */
export interface Arguments {
  id: string
  question: string
  answer: string
  reading: string
  player_id: string
  corrected_num: string
  wronged_num: string
  answered_num: string
  like_num: string
  is_history: string
}

/**
 * APIから取得されるデータ型
*/
export type Response = {
  result: string
}

export default defineEventHandler(async (event) => {
  try {
    const id = encodeURIComponent(getQuery(event).id as string)
    const question = encodeURIComponent(getQuery(event).question as string)
    const answer = encodeURIComponent(getQuery(event).answer as string)
    const reading = encodeURIComponent(getQuery(event).reading as string)
    const player_id = encodeURIComponent(getQuery(event).player_id as string)
    const corrected_num = encodeURIComponent(getQuery(event).corrected_num as string)
    const wronged_num = encodeURIComponent(getQuery(event).wronged_num as string)
    const answered_num = encodeURIComponent(getQuery(event).answered_num as string)
    const like_num = encodeURIComponent(getQuery(event).like_num as string)
    const is_history = encodeURIComponent(getQuery(event).is_history as string)
    const query = `?id=${id}&question=${question}&answer=${answer}&reading=${reading}&player_id=${player_id}&corrected_num=${corrected_num}&wronged_num=${wronged_num}&answered_num=${answered_num}&like_num=${like_num}&is_history=${is_history}`
    const response = await $fetch(endpoint + query)

    return JSON.parse(response as string) as Response
  } catch (err) {
    console.log(err)
    return { result: '1' }
  }
})
