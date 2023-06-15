import { Ref } from 'vue'

import type { Response as SelectAllResponse } from '@/server/api/quizzes/select-all'
import type { Arguments as SearchArguments, Response as SearchResponse } from '@/server/api/quizzes/search-quiz'
import type { Arguments as SelectArguments, Response as SelectResponse } from '@/server/api/quizzes/select'
// import type { Arguments as InsertArguments } from '@/server/api/quizzes/insert'
// import type { Arguments as UpdateArguments } from '@/server/api/quizzes/update'
// import type { Arguments as DeleteArguments } from '@/server/api/quizzes/delete'
import type { Arguments as UpdatePressArguments } from '@/server/api/quizzes/press'

/**
 * DBから取得されるデータ型
*/
export interface QuizData {
  quiz_id: number
  question: string
  answer: string
  reading: string
  corrected_num: number
  wronged_num: number
  answered_num: number
  like_num: number
  push_point: number
  created_at: string
  updated_at: string
}

export interface Reading {
  quiz_id: number
  order_num: number
  correct_char: string
  wrong_char1: string
  wrong_char2: string
  wrong_char3: string
}

export interface CompleteQuizData extends QuizData {
  readings: Reading[]
}

export type SelectQuizzes = () => Promise<SelectAllResponse>

export type SearchQuiz = (params: SearchArguments) => Promise<SearchResponse>

export type SelectQuiz = (params: SelectArguments) => Promise<SelectResponse>

// export type InsertQuiz = (params: InsertArguments) => Promise<string>
// export type UpdateQuiz = (params: UpdateArguments) => Promise<number>
// export type DeleteQuiz = (params: DeleteArguments) => Promise<number>

export type UpdatePress = (params: UpdatePressArguments) => Promise<number>

export type SortItem = {
  label: string
  key: 'question' | 'created_at' | 'car' | 'push_point' | 'quiz_id'
  order: 'ASC' | 'DESC' | 'NONE'
}

// Quizデータを扱うモジュール
export default function useQuiz(): {
  quizData: Ref<CompleteQuizData[]>
  selectQuizzes: SelectQuizzes
  selectQuiz: SelectQuiz
  searchQuiz: SearchQuiz
  // insertQuiz: InsertQuiz
  // updateQuiz: UpdateQuiz
  // deleteQuiz: DeleteQuiz
  updatePress: UpdatePress
  } {

  // APIから取得したままのデータ
  const quizData: Ref<CompleteQuizData[]> = useState('quizData', () => [])

  const selectQuizzes = async () => {
    const { data, error } = await useFetch('/api/quizzes/select-all')
    return error.value
      ? Promise.reject(error.value)
      : Promise.resolve(data.value)
  }

  const selectQuiz = async (params) => {
    const { data, error } = await useFetch('/api/quizzes/select', { params })
    return error.value
      ? Promise.reject(error.value)
      : Promise.resolve(data.value)
  }

  const searchQuiz: SearchQuiz = async (params) => {
    const { data, error } = await useFetch('/api/quizzes/search-quiz', { params })
    return error.value
      ? Promise.reject(error.value)
      : Promise.resolve(data.value)
  }

  // const insertQuiz: InsertQuiz = async (params) => {
  //   const { data, error } = await useFetch('/api/quizzes/insert', { params })
  //   return error.value
  //     ? Promise.reject(error.value)
  //     : Promise.resolve(data.value.result)
  // }

  // const updateQuiz: UpdateQuiz = async (params) => {
  //   const { data, error } = await useFetch('/api/quizzes/update', { params })
  //   return error.value
  //     ? Promise.reject(error.value)
  //     : Promise.resolve(data.value.result)
  // }

  // const deleteQuiz: DeleteQuiz = async (params) => {
  //   const { data, error } = await useFetch('/api/quizzes/delete', { params })
  //   return error.value
  //     ? Promise.reject(error.value)
  //     : Promise.resolve(data.value.result)
  // }

  const updatePress: UpdatePress = async (params) => {
    const { data, error } = await useFetch('/api/quizzes/press', { params })
    return error.value
      ? Promise.reject(error.value)
      : Promise.resolve(data.value.result)
  }

  return {
    quizData,
    selectQuizzes,
    selectQuiz,
    searchQuiz,
    // insertQuiz,
    // updateQuiz,
    // deleteQuiz,
    updatePress,
  }
}
