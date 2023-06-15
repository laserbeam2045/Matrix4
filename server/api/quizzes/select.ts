import type { IncomingMessage } from 'http'

import { API_PATH } from '../../db'

import { CompleteQuizData } from '@/composables/useQuiz'

/**
 * リクエストに必要なパラメータ
 */
export interface Arguments {
  id: string
}

/**
 * APIから取得されるデータ型
*/
export type Response = {
  status: 'ok' | 'ng'
  total: number
  items: CompleteQuizData[]
}

const endpoint = `${API_PATH}/quizzes/select/select.php`

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
