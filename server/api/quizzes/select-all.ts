import type { IncomingMessage } from 'http'

import { API_PATH } from '../../db'

import { QuizData } from '@/composables/useQuiz'

/**
 * APIから取得されるデータ型
*/
export type Response = {
  status: 'ok' | 'ng'
  total: number
  items: QuizData[]
}

const endpoint = `${API_PATH}/quizzes/select/all.php`

export default async (req: IncomingMessage) => {
  try {
    const response: string = await $fetch(endpoint + req.url)
    return JSON.parse(response) as Response
  } catch (err) {
    console.log(err)
    return {
      status: 'ng',
      total: 0,
      items: [],
    } as Response
  }
}
