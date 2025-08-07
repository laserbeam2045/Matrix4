<script lang="ts">
export default {
  layout: 'the-matrix',
}
</script>

<script setup lang="ts">
/* eslint-disable camelcase */
import { Ref } from 'vue'

import { useBreakpoints } from '@vueuse/core'

import { default as useQuiz } from '@/composables/useQuiz'
import type { SortItem, QuizData, CompleteQuizData } from '@/composables/useQuiz'
import { default as useQuizFilters } from '@/composables/useQuizFilters'
import { default as useQuizSorts } from '@/composables/useQuizSorts'

// import {
//   isNumeric,
//   isAlphabet,
//   isHiragana,
//   isKatakana,
// } from '@/utilities/v_string_functions'

const mounted = ref(false)

// const { setInfo } = useMatrix()

const {
  quizData,
  // selectQuizzes,
  // selectQuiz,
  searchQuiz,
  // insertQuiz,
  // updateQuiz,
  // deleteQuiz,
  updatePress,
} = useQuiz()

const {
  filters,
  filteredQuizzes,
} = useQuizFilters(quizData)

const {
  sortFunctions,
  sortedQuizzes,
} = useQuizSorts(filteredQuizzes)

const questionRef = ref<HTMLElement | null>(null)
const answerRef = ref<HTMLElement | null>(null)
const readingRef = ref<HTMLElement | null>(null)

const showDetailWindow = ref(false)
const showInsertWindow = ref(false)
const showUpdateWindow = ref(false)
const showDeleteWindow = ref(false)
const showPlayerWindow = ref(false)
const showQuizTagsWindow = ref(false)

const breakpoints = useBreakpoints({
  tablet: 640,
  laptop: 1024,
  desktop: 1280,
})

const phone = breakpoints.smaller('tablet')
const tablet = breakpoints.between('tablet', 'laptop')
const laptop = breakpoints.between('laptop', 'desktop')
const desktop = breakpoints.greater('desktop')

const state = reactive({
  quizId: 0,
  question: '',
  answer: '',
  reading: '',
  correctedNum: 0,
  wrongedNum: 0,
  answeredNum: 0,
  likeNum: 0,
  createdAt: '',
  updatedAt: '',
})

// 詳細ウィンドウ
const openDetailWindow = (payload: QuizData) => {
  state.quizId = payload.quiz_id
  state.question = payload.question
  state.answer = payload.answer
  state.reading = payload.reading
  state.correctedNum = payload.corrected_num
  state.wrongedNum = payload.wronged_num
  state.answeredNum = payload.answered_num
  state.likeNum = payload.like_num
  state.createdAt = payload.created_at
  state.updatedAt = payload.updated_at
  showDetailWindow.value = true
  playAudio(AUDIOS.ETC.DECISION_33)
  setTimeout(() => {
    target.value = '#treeBox'
  }, 100)
}

const closeDetailWindow = () => {
  target.value = '#hide'
  showDetailWindow.value = false
}

const target = ref('#hide')

// // 新規作成ウィンドウ
// const openInsertWindow = () => {
//   state.question = ''
//   state.answer = ''
//   state.reading = ''
//   state.correctAnswerRate = 50
//   showInsertWindow.value = true
// }

// const closeInsertWindow = () => {
//   // setInfo('Insert has been canceled')
//   showInsertWindow.value = false
// }

// // 編集ウィンドウ
// const openUpdateWindow = () => {
//   showUpdateWindow.value = true
//   showDetailWindow.value = false
//   playAudio(AUDIOS.ETC.DECISION_33)
// }

// const closeUpdateWindow = () => {
//   setInfo('Update was canceled')
//   showUpdateWindow.value = false
// }

// // 削除ウィンドウ
// const openDeleteWindow = () => {
//   showDeleteWindow.value = true
//   playAudio(AUDIOS.ETC.DECISION_33)
// }

// const closeDeleteWindow = () => {
//   setInfo('Delete was canceled')
//   showDeleteWindow.value = false
// }

const openPlayerWindow = () => {
  showPlayerWindow.value = true
  playAudio(AUDIOS.ETC.DECISION_33)
}

const closePlayerWindow = () => {
  showPlayerWindow.value = false
}

const openQuizTagsWindow = () => {
  showQuizTagsWindow.value = true
  playAudio(AUDIOS.ETC.DECISION_33)
}

const closeQuizTagsWindow = () => {
  showQuizTagsWindow.value = false
}

// // 問題を作成する関数
// const insert = async () => {
//   const { question, answer, reading, correctAnswerRate } = state
//   if (question && answer && reading && correctAnswerRate !== null) {
//     const params = { question, answer, reading, correctAnswerRate }
//     const id = await insertQuiz(params)
//     const quiz = await selectQuiz({ id })
//     quizData.value.push(quiz)
//     closeInsertWindow()
//     openInsertWindow()
//     questionRef.value.focus()
//     setInfo('Succeeded')
//     playAudio(AUDIOS.ETC.DECISION_30)
//   } else {
//     setInfo('Please fill all items')
//     playAudio(AUDIOS.ETC.CYBER_06_4)
//   }
// }

// // 問題を更新する関数
// const update = async () => {
//   const { id, question, answer, reading, correctAnswerRate } = state
//   if (id && question && answer && reading && correctAnswerRate !== null) {
//     const params = { id, question, answer, reading, correctAnswerRate }
//     await updateQuiz(params)
//     showUpdateWindow.value = false
//     search('')
//     setInfo('Succeeded')
//     playAudio(AUDIOS.ETC.DECISION_30)
//   } else {
//     setInfo('Please fill all items')
//     playAudio(AUDIOS.ETC.CYBER_06_4)
//   }
// }

// // 問題を削除する関数
// const remove = async () => {
//   const { id } = state
//   await deleteQuiz({ id })
//   showDeleteWindow.value = false
//   showDetailWindow.value = false
//   const index = quizData.value.findIndex((item) => item.id === id)
//   quizData.value.splice(index, 1)
//   setInfo('Succeeded')
//   playAudio(AUDIOS.ETC.DECISION_30)
// }

// 問題を検索する関数
const search = async (query: string) => {
  let word = query ? query : ''

  quizData.value = (await searchQuiz({ word, min: 1, max: 10000 })).items
  quizData.value.push(...(await searchQuiz({ word, min: 10000, max: 20000 })).items)
  quizData.value.push(...(await searchQuiz({ word, min: 20000, max: 30000 })).items)
  quizData.value.push(...(await searchQuiz({ word, min: 30000, max: 40000 })).items)
  quizData.value.push(...(await searchQuiz({ word, min: 40000, max: 50000 })).items)
}

// // FIXME: Why ref does not work?
// watch(() => state.question, (newVal, oldVal) => {
//   if (newVal && !oldVal && showInsertWindow.value) {
//     if (quizData.value.some((item) => item.question === newVal)) {
//       const item = quizData.value.find((item) => item.question === newVal)

//       closeInsertWindow()
//       state.id = item.id
//       state.question = item.question
//       state.answer = item.answer
//       state.reading = item.reading
//       state.correctAnswerRate = item.correctAnswerRate
//       state.createdAt = item.createdAt
//       state.updatedAt = item.updatedAt
//       openUpdateWindow()
//     } else {
//       (document.querySelector('#foo > input') as HTMLInputElement).focus()
//     }
//   }
// })

// // FIXME: Why ref does not work?
// watch(() => state.answer, (newVal, oldVal) => {
//   if (newVal && !oldVal && showInsertWindow.value)
//     (document.querySelector('#bar > input') as HTMLInputElement).focus()
// })

// watch(() => state.reading, (newVal, oldVal) => {
//   if (newVal && !oldVal && showInsertWindow.value) {
//     state.reading = squeeze(newVal)
//   }
// })

// const squeeze = (str) => {
//   let str2 = ''
//   for (let i = 0; i < str.length; i++) {
//     const c = str[i]
//     if (c === 'ー' || isHiragana(c) || isKatakana(c) || isNumeric(c) || isAlphabet(c)) {
//       str2 += c
//     }
//   }
//   return str2
// }

// 検索文字列
const searchQuery = useState('searchQuery', () => '')

// 並べ替えの条件
const sortConditions = ref<SortItem[]>([
  {
    key: 'quiz_id',
    label: 'Created',
    order: 'ASC',
  },
  {
    key: 'question',
    label: 'Question',
    order: 'ASC',
  },
  {
    key: 'car',
    label: 'Correct Answer Rate',
    order: 'ASC',
  },
  {
    key: 'push_point',
    label: 'Push Point',
    order: 'ASC',
  },
])

// フィルターの条件
const filterConditions = useState('filterConditions', () => ({
  unplayed: true,
  cleared: true,
  failed: true,
}))

const bitFilterCondition = computed(() => {
  const {
    unplayed: u,
    cleared: c,
    failed: f,
  } = filterConditions.value
  return 0 | ((Number(u)) << 2) | ((Number(c)) << 1) | ((Number(f)) << 0)
})

const failedIds = ref([]) as Ref<number[]>
const clearedIds = ref([]) as Ref<number[]>

const isFailed = (id: number) => failedIds.value.includes(id)
const isCleared = (id: number) => clearedIds.value.includes(id)
const isUnplayed = (id: number) => !isFailed(id) && !isCleared(id)

// watch([searchQuery, bitFilterCondition], () => {
// 問題にかけるフィルター
filters.value = [
  (quiz) => {
    const query = searchQuery.value.toLowerCase()
    return !query || (
      quiz.question.toLowerCase().includes(query) ||
      quiz.answer.toLowerCase().includes(query) ||
      quiz.reading.toLowerCase().includes(query)
    )
  },
  (quiz) => {
    switch (bitFilterCondition.value) {
    case 0: return false                      // 000: []
    case 1: return isFailed(quiz.quiz_id)     // 001: [c]
    case 2: return isCleared(quiz.quiz_id)    // 010: [b]
    case 3: return !isUnplayed(quiz.quiz_id)  // 011: [b, c]
    case 4: return isUnplayed(quiz.quiz_id)   // 100: [a]
    case 5: return !isCleared(quiz.quiz_id)   // 101: [a, c]
    case 6: return !isFailed(quiz.quiz_id)    // 110: [a, b]
    case 7: return true                       // 111: [a, b, c]
    }
  },
]
// })

// 並べ替えの条件
watch(sortConditions, () => {
  sortFunctions.value = sortConditions.value
    .map(({ key, order }) => {
      switch (order) {
      case 'NONE': return { key, order: 0 }
      case 'ASC': return { key, order: -1 }
      case 'DESC': return { key, order: 1 }
      }
    })
    .map(({ key, order }) => {
      return (a, b) => {
        if (a[key] < b[key]) return order
        if (b[key] < a[key]) return -order
        return 0
      }
    })
    .reverse()
}, {
  deep: true,
})

// const displayedAnswer = computed(() => {
//   return state.answer + ((state.answer !== state.reading) ? `\n${state.reading}` : '')
// })

const onFailed = (id: number) => {
  if (!failedIds.value.includes(id)) {
    failedIds.value.push(id)
  }
  if (clearedIds.value.includes(id)) {
    const index = clearedIds.value.findIndex((ID) => ID === id)
    clearedIds.value.splice(index, 1)
  }
}

const onSucceeded = (id: number) => {
  if (failedIds.value.includes(id)) {
    const index = failedIds.value.findIndex((ID) => ID === id)
    failedIds.value.splice(index, 1)
  }
  if (!clearedIds.value.includes(id)) {
    clearedIds.value.push(id)
  }
}

const tabIndexOne = ref(0)
const tabIndexTwo = ref(0)

const {
  AUDIOS,
  playAudio,
  // stopAudio,
} = useAudio()

const simulatePressPoints = async () => {
  for (let i = 0; i < quizData.value.length; i++) {
    console.log(`%c${i + 1} / ${quizData.value.length}`, 'color: orange')
    const { quiz_id: id, question, push_point: pp } = quizData.value[i]
    // if (1 < pp) continue
    let push_point
    for (push_point = 1; push_point < question.length; push_point++) {
      const exp = new RegExp(`^${question.slice(0, push_point)}.*`)
      if (!quizData.value.some(d => d.question !== question && exp.test(d.question))) {
        break
      }
    }
    if (pp !== push_point) await updatePress({ id, push_point })
  }
  console.log('finished')
}







onMounted(async () => {
  const { setInfo } = useMatrix()

  setInfo('')

  setTimeout(async () => {
    mounted.value = true
    search('')
  }, 1000)

  /*
  setTimeout(async () => {
    function a(e) {
      return fetch(e, Object.assign({
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvbWluaGF5YS5jb20iLCJzdWIiOiIyNTgyMjAzIiwiaWF0IjoxNjUzODgwODAzLCJleHAiOjE2NTQ0ODU2MDN9.8lgp1XRj1IwZeZ-JDuAfTBQXvS63DDAsVvN2LXWoE5Q',
        },
      }))
    }

    const getAndPost = async (quizId, x, y) => {
      try {
        const data = await a(`https://api.minhaya.com/quiz/quiz/?quiz_id=${quizId}`)
        const foo = await data.json()
        if (foo.code === 400) {
          console.table({ quizId, ...foo })
        } else if (foo.total) {
          if (foo.total !== '1') {
            console.log('%cなんか複数ある', 'color: green')
          }
          // eslint-disable-next-line camelcase
          const { quiz_id: id, readings, ...other } = foo.items[0]
          const params = { id, ...other }
          const result = await fetch('https://have-a-go.moo.jp/tree2/api/quizzes/insert/quiz3.php?' + new URLSearchParams(params))
          const bar = await result.json()
          if (bar.result === id) {
            console.log(`INSERTに成功: %c${x} / ${y}:  ${quizId}`, 'color: blue')
          } else {
            console.log('%cなんかINSERTに失敗した', 'color: purple')
          }
          readings.forEach(reading => {
            fetch('https://have-a-go.moo.jp/tree2/api/quizzes/insert/reading.php?' + new URLSearchParams(reading))
          })
        } else {
          console.log(`%c${quizId}`, 'color: orange')
        }
      } catch (e) {
        console.log(`%c${quizId}`, 'color: red')
      }
    }

    const history = await a('https://api.minhaya.com/quiz/quiz/history/?size=570&start=0')
    const fiz = await history.json()
    console.log(fiz)

    const ids = await a('https://have-a-go.moo.jp/tree2/api/quizzes/select/id.php')
    const buz = await ids.json()
    const IDs = buz.ids.map(({ quiz_id }) => String(quiz_id))
    const huge = fiz.items.filter(item => !IDs.includes(String(item.quiz_id)))

    for (let i = 0, len = huge.length; i < len; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await getAndPost(huge[i].quiz_id, i + 1, len)
    }
  }, 50)
  */

  // setTimeout(() => {
  //   simulatePressPoints()
  // }, 25000)
})
</script>

<template>
  <div class="the_sample_quiz" :class="{ mounted, phone, tablet, laptop, desktop }">
    <div id="hide" style="display: none;" />

    <!-- 一覧モーダル -->
    <keep-alive>
      <transition-group name="fade-list" mode="out-in">
        <div
          v-if="mounted && !showPlayerWindow"
          class="the_quiz_list_window"
        >
          <AppSlider
            v-model:tabIndex="tabIndexOne"
            :tabs="['LIST', 'SORT', 'FILTER']"
          >
            <TheQuizListWindow
              :quiz-data="sortedQuizzes"
              :failed-ids="failedIds"
              :cleared-ids="clearedIds"
              :sort-conditions="sortConditions"
              @open="openDetailWindow"
              @plus="() => 1/*openInsertWindow*/"
              @quiz="openPlayerWindow"
            />
            <TheQuizSortWindow
              :sort-conditions="sortConditions"
            />
            <TheQuizFilterWindow />
          </AppSlider>
        </div>
      </transition-group>
    </keep-alive>

    <TheQuizWindow
      v-if="showPlayerWindow"
      :quiz-data="sortedQuizzes"
      @close="closePlayerWindow"
      @failed="onFailed"
      @succeeded="onSucceeded"
    />

    <!-- <TheQuizTagsWindow
      :is-visible="showQuizTagsWindow"
      @close="closeQuizTagsWindow"
    /> -->

    <!-- 詳細モーダル -->
    <AppWindowModal
      :offset="1.2"
      :is-visible="showDetailWindow"
      :legend="'Quiz'"
      @close="closeDetailWindow"
    >
      <div
        v-if="mounted"
        class="my_container"
        :style="{ width: '359px' }"
      >
        <!-- <AppSlider
          v-model:tabIndex="tabIndexTwo"
          :tabs="['SUMMARY', 'TAG']"
          class="mt-4"
        > -->
        <div
          class="mt-2 overflow-visible"
          style="width: 327px;"
        >
          <div class="flex flex-row justify-between align-center" style="width: 100%;">
            <div class="flex relative" style="width: 48%;">
              <AppInputTextTwo
                :value="state.quizId"
                height="38px"
                placeholder=""
                readonly
                style="width: 100%; margin-bottom: 8px; text-align: right; font-family: Poppins;"
              />
              <p class="placeholder" style="z-index: 4; line-height: 41px; left: 16px; display: inline-block; position: absolute;">ID</p>
            </div>
            <div class="flex relative" style="width: 48%;">
              <AppInputTextTwo
                :value="state.likeNum.toLocaleString()"
                height="38px"
                placeholder=""
                readonly
                style="width: 100%; margin-bottom: 8px; text-align: right; font-family: Poppins;"
              />
              <p class="placeholder" style="z-index: 4; line-height: 41px; left: 16px; display: inline-block; position: absolute;">Like</p>
            </div>
          </div>
          <div style="height: 150px; width: 327px; margin-bottom: 30px; margin-top: 0px;">
            <p class="placeholder" style="text-align: left;">Question</p>
            <textarea
              v-model="state.question"
              spellcheck="false"
              autocomplete="off"
              readonly
            />
          </div>
          <div>
            <AppInputTextTwo
              :value="state.answer"
              height="38px"
              placeholder="Answer"
              readonly
              style="margin-bottom: 0px;"
            />
            <div class="mt-8">
              <AppInputTextTwo
                v-if="state.answer !== state.reading"
                :value="state.reading"
                height="38px"
                placeholder="Reading"
                readonly
                style="margin-bottom: 0px;"
              />
            </div>
          </div>
          <div class="flex justify-between mt-0">
            <div class="flex flex-col" style="justify-content: space-evenly; width: 38%; margin-top: 0px;">
              <div class="flex relative" style="width: 40%;">
                <AppInputTextTwo
                  :value="state.createdAt.match(/[0-9]*-[0-9]*-[0-9]*/)[0]"
                  height="38px"
                  placeholder="Created At"
                  readonly
                  style="width: 80%; text-align: center;"
                />
              </div>
              <div class="flex relative" style="width: 40%;">
                <AppInputTextTwo
                  :value="state.updatedAt.match(/[0-9]*-[0-9]*-[0-9]*/)[0]"
                  height="38px"
                  placeholder="Updated At"
                  readonly
                  style="width: 80%; text-align: center;"
                />
              </div>
            </div>
            <div class="flex align-center" style="align-items: center; flex-grow: 4; justify-content: center;">
              <div class="ml-3 pt-0 flex items-center justify-between overflow-visible pb-3 content-center">
                <div class="" style="flex-grow: 5; text-align: center;">
                  <p class="placeholder nowrap pt-4" style="text-align: center; white-space-nowrap;">Correct Answer Rate</p>
                  <div class="flex items-center justify-center overflow-visible pt-2">
                    <p class="placeholder ml-0 mr-4" style="text-align: right;">{{ state.correctedNum.toLocaleString() }}<br><span style="border-top: 1px solid #42cbf8; margin-top: -1px; padding-top:2px; display: inline-block;">{{ state.answeredNum.toLocaleString() }}</span></p>
                    <AppCircularProgressBarTwo :r="50" :percentage="Math.round((state.correctedNum / state.answeredNum) * 100)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="buttons">
              <AppButton class="button" @click="closeDetailWindow">CLOSE</AppButton>
              <AppButton class="button" @click="openUpdateWindow">EDIT</AppButton>
              <AppButton class="button" @click="openDeleteWindow">DELETE</AppButton>
            </div> -->
          <p class="placeholder">Tag <AppButton style="border-radius: 100%; width: 24px; height: 24px; line-height: 24px; margin: 0px 4px 4px; padding: 0;" @click="openQuizTagsWindow">+</AppButton></p>
          <div
            id="treeBox"
            class="py-2"
            style="background: rgba(0, 0, 0, 0.4); min-height: 38px;"
          />
        </div>
        <!-- </AppSlider> -->
      </div>
    </AppWindowModal>

    <!-- 新規作成モーダル -->
    <!-- <AppWindowModal
      :offset="1.2"
      :is-visible="showInsertWindow"
      @close="closeInsertWindow"
    >
      <div
        class="my_container -mt-8"
        :style="{ width: '359px' }"
      >
        <label>
          <p class="placeholder">Question</p>
          <textarea
            ref="questionRef"
            v-model="state.question"
            v-quick-focus
            v-focus
            spellcheck="false"
            autocomplete="off"
          />
        </label>
        <div class="mt-6">
          <AppInputTextTwo
            id="foo"
            ref="answerRef"
            v-model:value="state.answer"
            height="38px"
            placeholder="Complete Answer"
            :dynamic="false"
          />
        </div>
        <div class="mt-8">
          <AppInputTextTwo
            id="bar"
            ref="readingRef"
            v-model:value="state.reading"
            height="38px"
            placeholder="Answer"
            :dynamic="false"
          />
        </div>
        <div class="mt-12">
          <AppInputTextTwo
            v-model:value.number="state.correctAnswerRate"
            type="range"
            min="0"
            max="100"
            step="1"
            style="padding: 0; color: rgba(0,0,0,0.4);"
            :placeholder="`Correct Answer Rate (${state.correctAnswerRate}％)`"
            :dynamic="false"
          />
        </div>
        <div class="buttons mt-4">
          <AppButton class="button" @click="closeInsertWindow">CANCEL</AppButton>
          <AppButton class="button" @click="insert">INSERT</AppButton>
        </div>
      </div>
    </AppWindowModal> -->

    <!-- 編集モーダル -->
    <!-- <AppWindowModal
      :offset="1.2"
      :is-visible="showUpdateWindow"
      @close="closeUpdateWindow"
    >
      <div
        class="my_container -mt-8"
        :style="{ width: '359px' }"
      >
        <label>
          <p class="placeholder">Question</p>
          <textarea
            v-model="state.question"
            v-quick-focus
            v-focus
            spellcheck="false"
            autocomplete="off"
          />
        </label>
        <div class="mt-6">
          <AppInputTextTwo
            v-model:value="state.answer"
            placeholder="Complete Answer"
            height="38px"
            :dynamic="false"
          />
        </div>
        <div class="mt-8">
          <AppInputTextTwo
            v-model:value="state.reading"
            placeholder="Answer"
            height="38px"
            :dynamic="false"
          />
        </div>
        <div class="mt-12">
          <AppInputTextTwo
            v-model:value.number="state.correctAnswerRate"
            type="range"
            height="38px"
            min="0"
            max="100"
            step="1"
            style="padding: 0;"
            :placeholder="`Correct Answer Rate (${state.correctAnswerRate}％)`"
            :dynamic="false"
          />
        </div>
        <div class="buttons mt-4">
          <AppButton class="button" @click="closeUpdateWindow">CANCEL</AppButton>
          <AppButton class="button" @click="update">UPDATE</AppButton>
        </div>
      </div>
    </AppWindowModal> -->

    <!-- 確認ダイアログ -->
    <!-- <AppWindowModal
      legend="Delete"
      :offset="1.4"
      :is-visible="showDeleteWindow"
      @close="closeDeleteWindow"
    >
      <div class="my_container" style="width: 320px;">
        <pre class="info mb-8">Are you sure?</pre>
        <div class="buttons">
          <AppButton @click="closeDeleteWindow">Cancel</AppButton>
          <AppButton @click="remove">OK</AppButton>
        </div>
      </div>
    </AppWindowModal> -->
      <!-- <NuxtLayout name="the-footer2" /> -->
    <NuxtLayout name="the-header" />
    <NuxtLayout name="the-loading" />
    <NuxtLayout name="the-navigation" />
  </div>
</template>

<style lang="scss" scoped>
.audio {
  @include overflowScrollingY;
}

.placeholder {
  font-weight: bold;
  @include textStyleC;
}

.the_sample_quiz {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  // padding: 40px 0 40px;
  font-family: $fontFamily9;
  // background-size: auto 140%;
  // background-image: url('@/assets/images/northern-lights-in-iceland.jpg');
  // background-position: 30% -100px;
  // background-size: 100% 100%;
  // background-image: url('@/assets/images/b12.jpg');
  // background-repeat: no-repeat;
  // background-position: 0% 0%;
  // background: linear-gradient(rgb(24, 80, 153), rgb(4, 20, 82));
  // background: linear-gradient(rgb(0, 210, 255), rgb(24, 80, 153), rgb(4, 20, 82));
  background-color: rgb(4, 20, 82);
  background-image: linear-gradient(rgb(0, 210, 255) 0%, rgb(24, 80, 153) 32%, rgb(4, 20, 82) 74%);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $matrix1;
    transition: all 1.8s ease-out;
  }

  &.mounted {
    &::before {
      background-color: transparent;
    }
  }

  * {
    font-family: $fontFamily9;
  }

  // 640 < width
  &.phone {
    .the_quiz_list_window {
      padding: 64px 0px 0;
      width: 365px;
    }
  }

  // 640 <= width <= 1024
  &.tablet {
    .the_quiz_list_window {
      padding: 64px 0px 0;
      width: 630px;
      width: 99vw;
    }
  }

  // 1024 <= width <= 1280
  &.laptop {
    .the_quiz_list_window {
      padding: 64px 0px 0;
      width: 1014px;
      width: 630px;
      width: 1014px;
    }
  }

  // 1280 < width
  &.desktop {
    .the_quiz_list_window {
      padding: 64px 0px 0;
      width: 1270px;
      width: 630px;
      width: 99vw;
    }
  }
}

.my_container {
  padding: 0 16px;
  margin: 0 0 16px;
}

.placeholder {
  color: #ddd;
  font-size: 15px;
  font-family: $fontFamily9;
  text-align: left;
  @include unSelectable;
}

.buttons {
  display: flex;
  justify-content: space-evenly;
  transition: all .5s;

  .button {
    margin: 0px 0px 0;
  }
}

textarea {
  // width: 347px;
  width: 100%;
  // height: 201px;
  height: 126px;
  padding: 12px;
  color: $blueLikeColor6;
  // font: $normalFont;
  font-family: $fontFamily9;
  // background: transparent;
  background: rgba(0,0,0,0.4);
  // border: 1px solid $def-wrap-c2;
  border: 1px solid transparent;
  transition: $neutral-transition;
  outline: none;
  @include overflowScrollingY;

  &:not([readonly]):focus {
    // color: $act-input-c1;
    text-shadow: $text-shadow;
    // background: $act-input-c2;
    background: rgba(0,0,0,0.5);
    // border: 1px solid $act-wrap-c2;
    border: 1px solid $textColor2;
    color: $textColor2;
    outline: none;
    box-shadow :
      $act-input-c4  2px  2px 20px,
      $act-input-c4 -2px -2px 20px,
      $act-input-c4 -2px  2px 20px inset,
      $act-input-c4  2px -2px 20px inset;
    transition : $focused-transition;
  }
}

.fade-list-enter-active,
.fade-list-leave-active {
  transition: all 0.5s ease;
}

.fade-list-enter-from,
.fade-list-leave-to {
  opacity: 0;
}

.fade-list-enter-from {
  transform: scale(1.2);
}
</style>
