import type { IncomingMessage } from 'http'
import url from 'url'

import { API_PATH } from '../../db'

import type { CompleteQuizData } from '@/composables/useQuiz'

/**
 * リクエストに必要なパラメータ
 */
export interface Arguments {
  word: string
  min: number
  max: number
}

/**
 * APIから取得されるデータ型
*/
export type Response = {
  status: 'ok' | 'ng'
  total: number
  items: CompleteQuizData[]
}

const endpoint = `${API_PATH}/quizzes/select/search.php`

export default async (req: IncomingMessage) => {
  try {
    const a = url.parse(req.url, false)
    console.log(a, req.url)
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
