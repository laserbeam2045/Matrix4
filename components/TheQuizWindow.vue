<script setup lang="ts">
/* eslint-disable camelcase */
import gsap from 'gsap'

import { useBreakpoints } from '@vueuse/core'

import type { CompleteQuizData } from '@/composables/useQuiz'

import { shuffle } from '@/utilities/v_array_functions'

// import {
//   NUMERICS,
//   HIRAGANA,
//   KATAKANA,
//   ALPHABETS,
//   isNumeric,
//   isHiragana,
//   isKatakana,
//   isAlphabet,
// } from '@/utilities/v_string_functions'

const props = defineProps<{
  quizData: CompleteQuizData[]
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'failed', id: number): void
  (event: 'succeeded', id: number): void
}>()

const quizState = ref<
  'NUMBER' | 'READING' | 'COUNTING' |
  'ANSWERING' | 'CORRECT' | 'WRONG' |
  'DISPLAYING' | 'DISPLAYED' |
  'START' | 'NONE' | 'END'
>('START')

const { AUDIOS, playAudio, stopAudio } = useAudio()

const doShuffle = ref(false)
const charMode = ref(false)
const gradually = ref(false)
const autoStop = ref(false)

const quizData = ref(props.quizData.concat())

const breakpoints = useBreakpoints({
  tablet: 640,
  laptop: 1024,
  desktop: 1280,
})

const phone = breakpoints.smaller('tablet')
const tablet = breakpoints.between('tablet', 'laptop')
const laptop = breakpoints.between('laptop', 'desktop')
const desktop = breakpoints.greater('desktop')

const scale = computed(() => {
  if (phone.value) return 1
  if (tablet.value) return 1.5
  if (laptop.value) return 1.6
  if (desktop.value) return 1.7
  return 1
})

// 現在どの問題を出題しているか
const currentQuizIndex = ref(-1)
const maximumQuizIndex = computed(() => quizData.value.length - 1)
const currentQuiz = computed(() => quizData.value[currentQuizIndex.value])
const isMaxQuizIndex = computed(() => currentQuizIndex.value === maximumQuizIndex.value)

// 正答率
const correctCount = ref(0)
const correctAnswerRate = computed(() => Math.floor((correctCount.value / (maximumQuizIndex.value + 1)) * 100))

// 現在どこまで問題文を表示しているか
const currentQuestionIndex = ref(-1)
const maximumQuestionIndex = computed(() => (currentQuiz.value?.question ?? '').length - 1)

// 現在どこまで回答しているか
const currentAnswerTwoIndex = ref(-1)
const maximumAnswerTwoIndex = computed(() => (currentQuiz.value?.reading ?? '').length - 1)

// 回答がすべて入力されたかどうか
const isImputedAnswer = computed(() => currentAnswerTwoIndex.value === maximumAnswerTwoIndex.value)

// 現在表示中の問題文
const currentQuestion = computed(() => (currentQuiz.value?.question ?? '').slice(0, currentQuestionIndex.value + 1))

// 問題文がすべて表示されたかどうか
const isDisplayedQuestion = computed(() => currentQuestionIndex.value === maximumQuestionIndex.value)

const currentAnswer = computed(() => currentQuiz.value?.reading ?? '')
const currentAnswerChar = computed(() => currentAnswer.value[currentAnswerTwoIndex.value])
// const previousAnswerChar = computed(() => currentAnswer.value[currentAnswerTwoIndex.value - 1])

const currentInput = ref('')

const currentAnswerChars = computed(() => {
  const { correct_char, wrong_char1, wrong_char2, wrong_char3 } = currentQuiz.value.readings[currentAnswerTwoIndex.value]
  return shuffle([correct_char, wrong_char1, wrong_char2, wrong_char3])
  // const c = currentAnswerChar.value
  // const p = previousAnswerChar.value

  // if (c === undefined) return []

  // const charCode = c.charCodeAt(0)

  // const selections =
  //   isNumeric(c)
  //     ? NUMERICS.concat()
  //     : isHiragana(c === 'ー' ? p : c)
  //       ? HIRAGANA.concat()
  //       : isKatakana(c === 'ー' ? p : c)
  //         ? KATAKANA.concat()
  //         : isAlphabet(c) && 97 <= charCode && charCode <= 122
  //           ? ALPHABETS.concat()
  //           : ALPHABETS.map((c) => c.toUpperCase())

  // const list = [c]

  // const missMatch = (char: string) => {
  //   const exclude = ['ゎ', 'ゔ', 'ゕ', 'ゖ', 'ゐ', 'ゑ', 'ヮ', 'ヵ', 'ヶ', 'ヴ', 'ヷ', 'ヰ', 'ヸ', 'ヱ', 'ヹ', 'ヺ']
  //   const list = [
  //     ['ァ', 'ア', 'マ'],
  //     ['ィ', 'イ'],
  //     ['ゥ', 'ウ', 'ヴ', 'ヮ', 'ワ'],
  //     ['ェ', 'エ', 'ュ', 'ユ', 'コ', 'ゴ'],
  //     ['ォ', 'オ'],
  //     ['カ', 'ガ', 'ヵ'],
  //     ['キ', 'ギ'],
  //     ['ク', 'グ', 'ケ', 'ゲ', 'ヶ'],
  //     ['サ', 'ザ'],
  //     ['シ', 'ジ', 'ソ', 'ゾ', 'ン', 'ッ', 'ツ', 'ヅ', 'ヂ'],
  //     ['ス', 'ズ', 'ヌ', 'フ', 'ブ', 'プ'],
  //     ['セ', 'ゼ'],
  //     ['タ', 'ダ'],
  //     ['チ', 'ヂ'],
  //     ['テ', 'デ'],
  //     ['ト', 'ド'],
  //     ['ナ', 'メ'],
  //     ['ハ', 'バ', 'パ'],
  //     ['ヒ', 'ビ', 'ピ'],
  //     ['ヘ', 'ベ', 'ペ'],
  //     ['ホ', 'ボ', 'ポ'],
  //     ['ャ', 'ヤ'],
  //     ['ョ', 'ヨ'],
  //   ]

  //   if (exclude.includes(char)) return true

  //   for (let i = 0, len = list.length; i < len; i++) {
  //     if (list[i].includes(c) && list[i].includes(char)) return true
  //   }

  //   return false
  // }

  // while (list.length < 4) {
  //   let char = c
  //   while (list.includes(char) || missMatch(char)) {
  //     const index = Math.floor(Math.random() * selections.length)
  //     char = selections[index]
  //   }
  //   list.push(char)
  // }

  // return shuffle(list) as string[]
})

const currentAnswers = computed(() => {
  const list = [currentAnswer.value]
  const max = Math.min(4, maximumQuizIndex.value + 1)

  while (list.length < max) {
    let str = currentAnswer.value
    while (list.includes(str)) {
      const index = Math.floor(Math.random() * (maximumQuizIndex.value + 1))
      str = quizData.value[index].reading
    }
    list.push(str)
  }

  return shuffle(list) as string[]
})

const incremental = ref(false)

const data = reactive({
  progress: 0,
})

const initialize = () => {
  data.progress = 100
  currentQuestionIndex.value = -1
  currentAnswerTwoIndex.value = 0
}

const startGame = () => {
  if (doShuffle.value) {
    quizData.value = shuffle(quizData.value)
  }

  quizState.value = 'NUMBER'
}

// QUIZの状態に応じた処理
watch(quizState, (state) => {
  switch (state) {
  case 'NUMBER':
    // 第何問目かを表示するフェーズ
    if (isMaxQuizIndex.value) {
      playAudio(AUDIOS.ETC.DECISION_21)
      quizState.value = 'END'
    } else {
      playAudio(AUDIOS.ETC.DECISION_5)
      currentQuizIndex.value++
      initialize()
      setTimeout(() => {
        quizState.value = 'READING'
      }, 1500)
    }
    break
  case 'READING':
    // 問題文を表示中のフェーズ
    incremental.value = true
    playQuestion(100).then((flag) => {
      switch (flag) {
      case 0: quizState.value = 'COUNTING'; break
      case 1: quizState.value = 'ANSWERING'; break
      }
    })
    break
  case 'COUNTING':
    // 問題文がすべて表示され、ゲージが動いているフェーズ
    playAudio(AUDIOS.QUIZ.COUNT_DOWN)
    gsap
      .to(data, {
        ease: gsap.parseEase('linear'),
        delay: 0,
        duration: 5,
        progress: 0,
        onInterrupt: () => {
          quizState.value = 'ANSWERING'
          stopAudio(AUDIOS.QUIZ.COUNT_DOWN)
        },
      })
      .then(() => {
        quizState.value = 'WRONG'
        stopAudio(AUDIOS.QUIZ.COUNT_DOWN)
        emit('failed', currentQuiz.value.quiz_id)
      })
    break
  case 'ANSWERING':
    // 回答中のフェーズ
    gsap.killTweensOf(data)
    if (quizState.value !== 'ANSWERING') {
      return
    }
    playAudio(AUDIOS.QUIZ.COUNT_DOWN)
    data.progress = 100
    gsap
      .to(data, {
        ease: gsap.parseEase('linear'),
        delay: 0,
        duration: 30,
        progress: 0,
        // onInterrupt: () => {
        //   quizState.value = 'ANSWERING'
        //   stopAudio(AUDIOS.QUIZ.COUNT_DOWN)
        // },
      })
      .then(() => {
        quizState.value = 'WRONG'
        stopAudio(AUDIOS.QUIZ.COUNT_DOWN)
        emit('failed', currentQuiz.value.quiz_id)
      })
    break
  case 'CORRECT':
    // 正解した時のフェーズ
    emit('succeeded', currentQuiz.value.quiz_id)
    gsap.killTweensOf(data)
    stopAudio(AUDIOS.QUIZ.COUNT_DOWN)
    playAudio(AUDIOS.ETC.DECISION_25)
    setTimeout(() => {
      correctCount.value++
      currentInput.value = ''
      quizState.value = 'DISPLAYING'
    }, 1500)
    break
  case 'WRONG':
    // 不正解の時のフェーズ
    emit('failed', currentQuiz.value.quiz_id)
    gsap.killTweensOf(data)
    currentInput.value = ''
    stopAudio(AUDIOS.QUIZ.COUNT_DOWN)
    playAudio(AUDIOS.ETC.DECISION_6)
    setTimeout(() => {
      quizState.value = 'DISPLAYING'
    }, 1500)
    break
  case 'DISPLAYING':
    // 問題文を速めに表示中のフェーズ
    incremental.value = true
    playQuestion(20).then(() => {
      quizState.value = 'DISPLAYED'
    })
    break
  case 'DISPLAYED':
    // 問題文がすべて表示された状態のフェーズ
    setTimeout(() => {
      quizState.value = 'NONE'
      setTimeout(() => {
        quizState.value = 'NUMBER'
      }, 100)
    }, 2000)
    break
  }
})

// 問題文を再生する関数
const playQuestion = (interval: number): Promise<0 | 1> => {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      if (isDisplayedQuestion.value) {
        clearInterval(intervalId)
        resolve(0)
      } else if (incremental.value) {
        if (gradually.value) {
          currentQuestionIndex.value++
          if (quizState.value === 'READING' && autoStop.value && currentQuestionIndex.value + 1 >= (currentQuiz.value.push_point)) {
            onPressButton()
            clearInterval(intervalId)
            resolve(1)
          }
        } else {
          currentQuestionIndex.value = maximumQuestionIndex.value
        }
      } else {
        clearInterval(intervalId)
        resolve(1)
      }
    }, interval)
  })
}

// 回答権を得る関数
const onPressButton = () => {
  playAudio(AUDIOS.ETC.DECISION_37)
  incremental.value = false
  gsap.killTweensOf(data)
  quizState.value = 'ANSWERING'
}

const onPressSelection = (str: string) => {

  if (charMode.value) {
    onPressSelectionChar(str)
  } else {
    onPressSelectionAnswer(str)
  }
}

// 文字を押した時のハンドリング
const onPressSelectionChar = (char: string) => {
  currentInput.value += char

  if (currentAnswerChar.value === char) {
    if (isImputedAnswer.value) {
      currentAnswerTwoIndex.value++
      quizState.value = 'CORRECT'
      return
    }
    playAudio(AUDIOS.ETC.ETC_TYPE)
    currentAnswerTwoIndex.value++
    gsap.killTweensOf(data)
    data.progress = 100
    gsap
      .to(data, {
        ease: gsap.parseEase('linear'),
        delay: 0,
        duration: 3,
        progress: 0,
      // onInterrupt: () => {
      //   quizState.value = 'ANSWERING'
      //   stopAudio(AUDIOS.QUIZ.COUNT_DOWN)
      // },
      })
      .then(() => {
        quizState.value = 'WRONG'
        stopAudio(AUDIOS.QUIZ.COUNT_DOWN)
        emit('failed', currentQuiz.value.quiz_id)
      })
  } else {
    currentAnswerTwoIndex.value++
    quizState.value = 'WRONG'
    return
  }
}

// 文字を押した時のハンドリング
const onPressSelectionAnswer = (str: string) => {
  if (currentAnswer.value === str) {
    quizState.value = 'CORRECT'
  } else {
    quizState.value = 'WRONG'
  }
}

const mounted = ref(false)

// watch(() => props.isVisible, (visible) => {
//   if (visible) {
//   } else {
//     initialize()
//     currentQuizIndex.value = -1
//     quizState.value = 'NUMBER'
//   }
// })

onMounted(() => {
  setTimeout(() => {
    mounted.value = true
  }, 100)
})
</script>

<template>
  <AppWindowModal
    v-center
    v-draggable
    legend="Quiz"
    :is-visible="mounted"
    :style="{ transform: `scale(${scale})` }"
    @close="$emit('close')"
  >
    <div class="the_quiz_window">
      <p class="the_quiz_number">
        <span class="numerator">{{ currentQuizIndex + 1 }}</span>
        <span class="secant"> / </span>
        <span class="denominator">{{ maximumQuizIndex + 1 }}</span>
      </p>

      <AppSkillsBar :progress="data.progress" />

      <transition-group
        tag="div"
        name="question"
        class="question_container"
        :appear="true"
      >
        <div v-if="quizState === 'START'" class="settings_container">
          <div class="inner_container">
            <label>Shuffle: <AppInputCheckbox v-model:checked="doShuffle" /></label>
            <label>Gradually show problems: <AppInputCheckbox v-model:checked="gradually" /></label>
            <label>Answer by character: <AppInputCheckbox v-model:checked="charMode" /></label>
            <label>Auto stop: <AppInputCheckbox v-model:checked="autoStop" /></label>
          </div>
          <div class="mt-8 button_container">
            <AppButton @click="startGame">
              START
            </AppButton>
          </div>
        </div>
        <div
          v-if="quizState === 'NUMBER'"
          class="font-extrabold absolute"
          style="width: 333px"
        >
          <p class="mr-4">No. {{ currentQuizIndex + 1 }}</p>
        </div>
        <div
          v-if="quizState === 'END'"
          class="font-extrabold absolute"
          style="width: 333px"
        >
          <div class="mt-8 flex items-center justify-center overflow-visible">
            <p class="placeholder ml-0 mr-3 text-left">Correct<br>Answer<br>({{ correctCount }} / {{ maximumQuizIndex + 1 }})</p>
            <AppCircularProgressBarTwo :r="50" :percentage="correctAnswerRate" />
          </div>
          <!-- <p class="mt-8">{{ correctCount }} / {{ maximumQuizIndex + 1 }}</p> -->
        </div>
        <div v-if="!['START', 'NONE', 'NUMBER', 'END'].includes(quizState)" class="flex quest">
          <span class="mr-4">Q.</span>
          <div class="question">
            <span
              v-for="(c, i) in currentQuestion"
              :key="i"
              :class="{ yet: i < currentQuiz.pressPoint }"
            >
              {{ c }}
            </span>
          </div>
        </div>
      </transition-group>

      <transition name="answer" :appear="true">
        <div v-if="['DISPLAYED'].includes(quizState)" class="answer_container">
          <span class="one">A. {{ currentQuiz.answer }}</span>
          <span v-if="currentQuiz.answer !== currentQuiz.reading" class="two">{{ currentQuiz.reading }}</span>
        </div>
      </transition>

      <transition name="result" :appear="true">
        <div v-if="['CORRECT', 'WRONG'].includes(quizState)" class="result_container">
          <AppSquidGame :color="quizState === 'CORRECT' ? '#2dfc52' : '#ea4884'" :icon="quizState === 'CORRECT' ? 'o' : 'x'" />
        </div>
      </transition>

      <transition name="button" :appear="true">
        <div v-if="['READING', 'COUNTING'].includes(quizState)" class="button_container">
          <AppButtonTwo @start.once="onPressButton">
            ANSWER
          </AppButtonTwo>
        </div>
      </transition>

      <transition-group
        tag="div"
        name="input"
        class="input_container"
      >
        <span v-for="(c, i) in currentInput" :key="i">
          {{ c }}
        </span>
      </transition-group>

      <transition-group
        v-if="quizState === 'ANSWERING'"
        :key="`${currentQuizIndex}-${currentAnswerTwoIndex}`"
        tag="div"
        class="button_container"
        :class="{ char_mode: charMode }"
        name="button"
        :appear="true"
      >
        <AppButtonTwo
          v-for="c in (charMode ? currentAnswerChars : currentAnswers)"
          :key="`${currentQuizIndex}-${currentAnswerTwoIndex}-${c}`"
          @start.once="onPressSelection(c)"
        >
          {{ c }}
        </AppButtonTwo>
      </transition-group>
    </div>
  </AppWindowModal>
</template>

<style lang="scss" scoped>
@keyframes bounce-in {
  0% {
    transform: scale(1.0) translateX(60px);
  }
  50% {
    transform: scale(1.0) translateX(0px);
  }
  100% {
    transform: scale(1) translateX(0px);
  }
}

.placeholder {
  @include textStyleC;
}

.the_quiz_window {
  width: 365px;
  height: 451px;
  padding: 0 16px 16px;
  font-family: $fontFamily9;

  .the_quiz_number {
    color: #fff;
    // @include textStyleC;

    .numerator{
      display: inline-block;
      min-width: 36px;
      text-align: right;
    }

    .denominator {
      display: inline-block;
      min-width: 36px;
      text-align: left;
    }
  }

  .question_container {
    display: flex;
    margin: 16px 0 0;
    color: #fff;
    font-size: 15px;
    font-family: $fontFamily9;

    > div:not(.quest) {
      @include textStyleC;
      font-size: 20px;
    }

    .question {
      display: flex;
      flex-wrap: wrap;

      .yet {
        @include textStyleC;
      }
    }

    .settings_container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      width: 365px;

      .inner_container {
        display: flex;
        flex-direction: column;
        padding: 16px 0px;
        width: 99%;

        > label {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          height: 44px;
        }
      }
    }
  }

  .answer_container {
    margin: 8px 8px 0;
    float: right;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    justify-content: flex-start;
    text-align: left;
    font-family: $fontFamily9;
    @include textStyleC;

    .one {
      border-bottom: 1px solid skyblue;
      margin-bottom: 2px;
      // box-shadow:
      //   0 -1px 4px #00b3ff,
      //   0 +1px 8px #00b3ff;
    }
  }

  .result_container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-bottom: 128px;
    color: #fff;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .input_container {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 145px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    z-index: 10;
    transition: all 0.25s ease-out;

    @include textStyleC;
  }

  .button_container {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 160px;
    padding: 60px 0 36px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;

    &.char_mode {
      flex-direction: row;
    }

    &:not(.char_mode) {
      height: 280px;
      padding: 0 16px 16px;
      flex-direction: column;
    }

    > * {
      margin-top: 8px;
    }
  }

  .question-enter-active,
  .question-leave-active {
    transition: all .25s ease-out;
  }
  .question-enter-from,
  .question-leave-to {
    opacity: 0;
  }

  .answer-enter-active,
  .answer-leave-active {
    transition: all .25s ease-out;
  }
  .answer-enter-from,
  .answer-leave-to {
    opacity: 0;
  }

  .result-enter-active,
  .result-leave-active {
    transition: all .25s ease-out;
  }
  .result-enter-from,
  .result-leave-to {
    opacity: 0;
  }

  .input-move,
  .input-enter-active,
  .input-leave-active {
    transition: all 0.25s ease-out;
  }
  // .input-leave-active {
  //   position: absolute;
  //   opacity: 0;
  //   // animation: bounce-in 0.5s;
  // }
  .input-enter-from {
    opacity: 0;
  }
  .input-leave-to {
    opacity: 0;
  }

  .button-enter-active,
  .button-leave-active {
    transition: all .25s ease-out;
  }
  .button-enter-from,
  .button-leave-to {
    opacity: 0;
    transform: translateY(32px);
  }
}
</style>
