import { Ref } from 'vue'
import type { CompleteQuizData } from '@/composables/useQuiz'

export default function useQuizFilters(quizzes: Ref<CompleteQuizData[]>) {
  const filters: Ref<((CompleteQuizData) => boolean)[]> = ref([])

  const filteredQuizzes = computed(() => {
    return quizzes.value
      .filter(quiz => {
        return filters.value.every(filter => filter(quiz))
      })
      .map(quiz => ({ ...quiz, car: (quiz.corrected_num / quiz.answered_num) * 100 }))
  })

  return {
    filters,
    filteredQuizzes,
  }
}
