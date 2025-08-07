<script lang="ts">
export default {
  layout: 'the-matrix',
}
</script>

<script setup lang="ts">
import gsap from 'gsap'

import { permutations } from '@/utilities/v_array_functions'

const charA = ref('')
const charB = ref('')
const charC = ref('')
const charD = ref('')

type Spell = {
  character: string
  mode: 'none' | 'hit' | 'blow'
}

type Word = Spell[]

const words = ref<Word[]>([])

const clear = () => {
  charA.value = ''
  charB.value = ''
  charC.value = ''
  charD.value = ''
  words.value = []
  wordLength.value = 2
}

const appendWord = () => {
  if (charC.value.length === wordLength.value) {
    charD.value = charC.value
    const word = charC.value
      .split('')
      .map((c) => c.toUpperCase())
      .map((c) => ({ character: c, mode: 'none' } as Spell))
    words.value.push(word)
    charC.value = ''
  } else if (words.value.length === 0) {
    wordLength.value = charC.value.length
    const word = charC.value
      .split('')
      .map((c) => c.toUpperCase())
      .map((c) => ({ character: c, mode: 'none' } as Spell))
    words.value.push(word)
    charC.value = ''
  } else {
    alert('Invalid word length.')
  }
}

const updateMode = (indexOne: number, indexTwo: number) => {
  const { mode } = words.value[indexOne][indexTwo]
  const newMode = mode === 'none' ? 'blow' : (mode === 'blow' ? 'hit' : 'none')
  words.value[indexOne][indexTwo].mode = newMode
}

const double = ref(false)
const expert = ref(false)
const anagram = ref(false)

const wordLength = ref(2)

const { data: allList }: { data: any } = await useFetch('/api/chart/select')

// 全ての単語を文字数別に二次元配列にしたもの
const list1 = computed(() => {
  const list = allList.value.map(word => word.toLowerCase())

  return Array(46).fill(0).map((n, i) => (
    list.filter(word => word.length === i)
  ))
})

// 全ての単語のうち、文字数がwordLengthと等しいものの配列
const list2 = computed(() => {
  const length = Math.max(0, Math.min(45, wordLength.value))
  return list1.value[length]
})

// Doubleがfalseである場合に、文字が重複する単語を取り除いたもの
const list3 = computed(() => {
  let list = list2.value.concat()

  if (double.value === false) {
    list = list.filter(word => {
      for (let i = 0, len = word.length; i < len; i++) {
        const a = word[i]
        for (let j = i + 1; j < len; j++) {
          const b = word[j]
          if (a === b) return false
        }
      }
      return true
    })
  }

  return list
})

// charAの指定がある場合に、それら全ての文字を含む単語のみに絞ったもの
const list4 = computed(() => {
  let list = list3.value.concat()
  
  // 必要に応じてコメントアウト
  const exp = new RegExp("[0-9\&\'\-\.\"\,]+", 'g')
  list = list.filter(w => !w.match(exp))

  if (!(charA.value)) {
    return list
  }

  charA.value
    .trim()
    .split(' ')
    .map(c => c.toLowerCase())
    .filter(c => !(/\s/).test(c))
    .forEach(c => list = list.filter(word => word.includes(c)))

  return list
})

// charBの指定がある場合に、それら全ての文字を含まない単語のみに絞ったもの
const list5 = computed(() => {
  let list = list4.value

  if (!charB.value) {
    return list.concat()
  }

  charB.value
    .trim()
    .split(' ')
    .map(c => c.toLowerCase())
    .filter(c => !(/\s/).test(c))
    .forEach(c => list = list.filter(word => !word.includes(c)))

  return list
})

const list6 = computed(() => {
  let list = list5.value

  if (!words.value.length) {
    return list.concat()
  }

  if (anagram.value) {
    const set = new Set()
    permutations(charD.value.split('')).map(ar => ar.join('')).forEach(w => set.add(w))
    // return list5.value
    return ([...set]).filter((w, i) => list3.value.includes(w))
  }

  let expWord = []
  let noneWords = '[^'

  const notUsableCharacters = []
  const usableCharacters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

  words.value.forEach((word) => {
    const WORD = word.map(W => W.character.toLowerCase()).join('')
    word.forEach((spell, i) => {
      const { character: C, mode } = spell
      const c = C.toLowerCase()
      const exp = new RegExp(c, 'g')
      const len2 = (WORD.match(exp) ?? '').length
      // if (mode === 'blow') {
      //   console.log(word.map(W => W.character.toLowerCase()).join(''))
      // }

      switch (mode) {
        case 'none': usableCharacters.splice(usableCharacters.indexOf(c), 1); break
        case 'blow': break
        case 'hit' : break
      }

      switch (mode) {
        case 'none': list = list.filter((w) => w.includes(c) && (((w.match(exp) ?? '').length) === len2) ? false : true); break
        case 'blow': list = list.filter((w) => (((w.match(exp) ?? '').length) === len2 || w[i] === c) ? false : true); break
        case 'hit' : list = list.filter((w) => w[i] === c); break
      }
    })
  })

  return list
})

const hashTable = {
  a: 1,
  b: 2,
  c: 4,
  d: 8,
  e: 16,
  f: 32,
  g: 64,
  h: 128,
  i: 256,
  j: 512,
  k: 1024,
  l: 2048,
  m: 4096,
  n: 8192,
  o: 16384,
  p: 32768,
  q: 65536,
  r: 131072,
  s: 262144,
  t: 524288,
  u: 1048576,
  v: 2097152,
  w: 4194304,
  x: 8388608,
  y: 16777216,
  z: 33554432,
}

const list7 = computed(() => {
  let list = list6.value

  list.sort((a, b) => a > b ? 1 : -1)

  let hashBox = {}

  list.forEach((item, index) => {
    let hash = 0
    let item2 = item.split('')
    item2.sort((a, b) => a > b ? 1 : -1)
    item2 = item2.join('')

    if (hashBox[item2] === undefined) {
      hashBox[item2] = []
    }

    hashBox[item2].push(item)
  })

  Object.keys(hashBox).forEach((key: string) => {
    const first = hashBox[key][0]
    // hashBox[key] = hashBox[key].filter((word, index) => !(index && (word[5] + word[6] === first[5] + first[6])))
    // hashBox[key] = hashBox[key].filter((word, index) => !((word[5] + word[6] === 'ed')))
    // hashBox[key] = hashBox[key].filter((word, index) => !(index && (word[0] === first[0])))
    // if (hashBox[key].length < 2) {
    //   delete hashBox[key]
    // }
  })

  // 1 2 3 4 5 6 7 8 9 0
  // Q W E R T Y U I O P

  // 08 = E.
  // PI = ④.1⑤1①②③⑥535897932384626433832795⑥

  // I?? = ①②③④⑤ at the top of the world
  // How many meters is the tower at the top of the world?
  // How many meters is the ①②③④⑤ at the top of the world?

  // The ①②③④⑤ at the top of the world is 828m

  // How many meters is the ①②③④⑤ at the top of the world?

  // DEEP NEURAL NETWORK = DEEP LEARNING
  // D③③P N③⑦④AL N③⑤②⑨④K = D③③P ????????

  // What is the tallest ①②③④⑤ in Japan?

  // 59234 at the top of the world
  // Tower at the top of the world

  // 123456 = QWERTY
  // 08 = ④.⑤Q①②③
  // 3.141592
  // ④.Q⑤Q①②③

  //      ３.１４１５９
  // ①②③④⑤ = ?????
  // ①③

  // to = 59

  // yet = 635
  // eye = 363
  // too = 599
  // out = 975
  // two = 529
  // top = 590
  // put = 075
  // wet = 235
  // toy = 596
  // try = 546
  // you = 697

  // tire = 5843
  // tour = 5974
  // pure = 0743
  // tree = 5433
  // true = 5473
  // trip = 5480
  // type = 5603
  // your = 6974
  // were = 2343

  // power = 09234

  // error = 34495
  // tower = 59234
  // write = 24853
  // worry = 29446

  // europe = 374903
  // pretty = 043556
  // output = 975075
  // potter = 095534
  // report = 430945
  // proper = 049034
  // quoter = 179534
  // qwerty = 123456
  // router = 497534
  // writer = 248534

  // twitter = 5285534
  // require = 4317843

  // priority = 04894856

  // prototype = 049595603
  // territory = 534485946

  // require = 4317843

  // 123456 = qwerty

  // 374903 5974 = europe tour

  // add
  // sad
  // has
  // had
  // all

  // fall
  // flag
  // half

  return hashBox
  // return list.splice(0, 200)
})

const beforeEnter = (el) => {
  el.style.opacity = 0
  el.style.height = 0
}

const enter = (el, done) => {
  gsap.to(el, {
    opacity: 1,
    height: '1.6em',
    delay: Math.min(3, el.dataset.index * .15),
    onComplete: done,
  })
}

const leave = (el, done) => {
  gsap.to(el, {
    opacity: 0,
    height: 0,
    delay: Math.min(3, el.dataset.index * .15),
    onComplete: done,
  })
}

const mounted = ref(false)

onMounted(() => {
  const { setInfo } = useMatrix()

  setInfo('')

  setTimeout(() => {
    mounted.value = true
  }, 2100)
})

// setTimeout(async () => {
//   function a(e) {
//     return fetch(e, Object.assign({
//       mode: 'cors',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     }))
//   }

//   const getAndPost = async (wordId, x, y, boin) => {
//     try {
//       // eslint-disable-next-line camelcase
//       const params = { id: wordId, boin }
//       const result = await fetch('https://have-a-go.moo.jp/tree2/api/words/update.php?' + new URLSearchParams(params))
//       const bar = await result.json()
//       console.log(`INSERTに成功: %c${x} / ${y}:  ${boin}`, 'color: blue')
//     } catch (e) {
//       console.log(`%c${wordId}`, 'color: red')
//     }
//   }

//   const history = await a('https://have-a-go.moo.jp/tree2/api/words/select.php')
//   const fiz = await history.json()
//   console.log(fiz)

//   fiz.items.sort((a, b) => Number(a.id) < Number(b.id) ? -1: 1 )

//   for (let i = 0, len = fiz.items.length; i < len; i++) {
//     const { id, word, boin: bi } = fiz.items[i]
//     let boin = ''
//     word.split('').forEach(c => {
//       if (!c) return
//       if (['ア', 'カ', 'ガ', 'サ', 'ザ', 'タ', 'ダ', 'ナ', 'ハ', 'バ', 'パ', 'マ', 'ヤ', 'ラ', 'ワ'].includes(c)) boin += 'a'
//       if (['イ', 'キ', 'ギ', 'シ', 'ジ', 'チ', 'ヂ', 'ニ', 'ヒ', 'ビ', 'ピ', 'ミ',       'リ'      ].includes(c)) boin += 'i'
//       if (['ウ', 'ク', 'グ', 'ス', 'ズ', 'ツ', 'ヅ', 'ヌ', 'フ', 'ブ', 'プ', 'ム', 'ユ', 'ル'      ].includes(c)) boin += 'u'
//       if (['エ', 'ケ', 'ゲ', 'セ', 'ゼ', 'テ', 'デ', 'ネ', 'ヘ', 'ベ', 'ペ', 'メ',       'レ'      ].includes(c)) boin += 'e'
//       if (['オ', 'コ', 'ゴ', 'ソ', 'ゾ', 'ト', 'ド', 'ノ', 'ホ', 'ボ', 'ポ', 'モ', 'ヨ', 'ロ', 'ヲ'].includes(c)) boin += 'o'
//       if (['ー'].includes(c)) boin = boin.slice(0, boin.length) + boin[boin.length - 1]
//       if (['ッ'].includes(c)) boin += 't'
//       if (['ン'].includes(c)) boin += 'n'
//       if (['ァ'].includes(c)) boin = boin.slice(0, boin.length - 1) + 'a'
//       if (['ィ'].includes(c)) boin = boin.slice(0, boin.length - 1) + 'i'
//       if (['ゥ'].includes(c)) boin = boin.slice(0, boin.length - 1) + 'u'
//       if (['ェ'].includes(c)) boin = boin.slice(0, boin.length - 1) + 'e'
//       if (['ォ'].includes(c)) boin = boin.slice(0, boin.length - 1) + 'o'
//       if (['ャ'].includes(c)) boin = boin.slice(0, boin.length - 1) + 'a'
//       if (['ュ'].includes(c)) boin = boin.slice(0, boin.length - 1) + 'u'
//       if (['ョ'].includes(c)) boin = boin.slice(0, boin.length - 1) + 'o'
//     })
//     if (bi !== boin) {
//       await new Promise(resolve => setTimeout(resolve, 100))
//       await getAndPost(id, i + 1, len, boin)
//     }
//   }
// }, 50)

</script>

<template>
  <!-- <NuxtLayout v-if="mounted" name="the-matrix-code" /> -->
  <div class="chart pt-16 pb-8 px-8" :class="{ mounted }">
    <div class="box px-4 pt-2 pb-1 mb-6">
      <div v-if="expert" class="expert">
        <div
          v-for="(word, index) in words"
          :key="index"
          class="word flex"
        >
          <div
            v-for="(spell, index2) in word"
            :key="`${index}-${index2}-${spell.character}`"
            :class="['char', spell.mode]"
            @click.self="updateMode(index, index2)"
          >
            {{ spell.character }}
          </div>
        </div>
        <AppInputTextThree
          v-model:value="charC"
          :activate="true"
          placeholder="Word"
          class="my-6"
          @keydown.enter="() => { wordLength = charC.length; appendWord(); }"
        />
      </div>
      <div v-else>
        <AppInputTextTwo
          v-model:value="charA"
          placeholder="Use"
          :dynamic="false"
          class="mb-8"
        />
        <AppInputTextTwo
          v-model:value="charB"
          placeholder="Not use"
          :dynamic="false"
          class="mb-4"
        />
      </div>
      <div class="flex">
        <AppInputTextTwo
          v-model:value="wordLength"
          type="number"
          placeholder="Length"
          class="mb-4"
          style="width: 64px; min-width: 64px; max-width: 64px"
        />
        <div class="ml-4">
          <p class="placeholder">Double</p>
          <AppInputCheckbox v-model:checked="double" />
        </div>
        <div class="ml-4">
          <p class="placeholder">Expert</p>
          <AppInputCheckbox v-model:checked="expert" />
        </div>
        <div class="ml-4">
          <p class="placeholder">Anagram</p>
          <AppInputCheckbox v-model:checked="anagram" />
        </div>
        <div class="flex items-center ml-4">
          <AppButton @end.self="clear">Clear</AppButton>
        </div>
      </div>
    </div>
    <h2 class="result mb-4">{{ list6.length }} results</h2>
    <!-- <transition-group
      name="staggered-fadee"
      tag="ul"
      :css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    > -->
    <li
      v-for="item in list7"
      :key="item"
      :data-index="item"
    >
      {{ item }}
    </li>
    <!-- </transition-group> -->
    <!-- <NuxtLayout name="the-footer2" /> -->
    <NuxtLayout name="the-header" />
    <NuxtLayout name="the-loading" />
    <NuxtLayout name="the-navigation" />
  </div>
</template>

<style lang="scss" scoped>
.chart {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-family: $fontFamily9;
  font-family: $fontFamily7;
  // background-size: auto 140%;
  // background-image: url('@/assets/images/northern-lights-in-iceland.jpg');
  // background-position: 30% -100px;
  // background-size: 100% 100%;
  // background-image: url('@/assets/images/blue_bg_lisd_generic.jpg');
  // background-repeat: no-repeat;
  // background-position: 0% 0%;
  background-color: rgb(4, 20, 82);
  background-image: linear-gradient(rgb(0, 210, 255) 0%, rgb(24, 80, 153) 32%, rgb(4, 20, 82) 74%);
  @include overflowScrollingY;

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

  // * {
  //   font-family: $fontFamily9;
  // }

  .box {
    border-radius: 12px;
    backdrop-filter: blur(2px);
    background-color: rgba(34,198,213, 0.15);
    // box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
    border: 1px rgba(255,255,255,0.4) solid;
    // color: $textColor1;
    color: #fff;
    @include textStyleC;

    .expert {

      .word {
        margin-top: 8px;
        @include unSelectable;

        .char {
          display: inline-block;
          width: 35px;
          height: 35px;
          line-height: 35px;
          text-align: center;
          // color: #fff !important;
          color: #fff;
          @include textStyleC;
          // border: 1px solid #000;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s linear;

          &:not(:first-child) {
            margin-left: 8px;
          }

          &.none {
            background: rgb(0,30,100);
          }
          &.blow {
            background: orange;
          }
          &.hit {
            background: limegreen;
          }
        }
      }
    }
  }

  .result {
    color: #fff;
    @include textStyleC;
  }
}

.flip-list-move {
  transition: transform 0.8s ease;
}
</style>
