import { Ref } from 'vue'
import type { QuizData } from '@/composables/useQuiz'

export default function useQuizSorts(quizzes: Ref<QuizData[]>) {
  const sortFunctions: Ref<((a: QuizData, b: QuizData) => number)[]> = ref([])

  const sortedQuizzes = computed(() => {
    let data = quizzes.value.concat()
    sortFunctions.value.forEach(fn => {
      data = data.sort(fn)
    })
    return data
  })

  return {
    sortFunctions,
    sortedQuizzes,
  }
}
