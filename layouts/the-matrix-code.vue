<template>
  <div id="matrix-code">
    <p
      v-for="(data) in objects"
      :key="data.key"
      :style="data.style"
      class="code"
    >
      <span
        v-for="(c, j) in data.code.split('')"
        :key="j"
        class="charactor"
      >
        {{ c }}
      </span>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { HANKAKU_KATAKANA, NUMERICS } from '@/utilities/v_string_functions'

type Code = {
  key: number
  code: string
  style: {
    top: string
    left: string
    fontSize: string
    lineHeight: string
    opacity: number
  }
}

const objects = ref<Code[]>([])

const texts =
  'ÁÉÍÓÚÝÀÈÌÒÙÂÊÎÔÛÄËÏÖÜŸáéíóúýàèìòùâêîôûäëïöüÿÇŞÃÕÑĄĘĮŲÆŒØĲẞÞǷçşãõñąęįųæœøĳßþƿ'
  + HANKAKU_KATAKANA.join('')
  + NUMERICS.join('')

const textLength = texts.length

const intervalId = ref<NodeJS.Timeout | null>(null)

const getChar = () => texts[Math.floor(Math.random() * textLength)]

onMounted(() => {
  const { innerWidth } = window
  const amount = innerWidth / 32

  const getPos = (pos: string) => {
    // const posX = Math.floor(Math.random() * (innerWidth - 40)) + 40
    // const posY = Math.floor(Math.random() * innerHeight * 0.3) + 40
    const posX = pos
    const posY = 77

    return { posX, posY }
  }

  for (let i = 0; i < amount; i++) {
    const { posX, posY } = getPos((i * 31 + 31) + '')
    // const size = Math.floor(Math.random() * 8) + 20
    // const size = Math.floor(Math.random() * 8) + 20
    const size = 24
    const delay = Math.random() * 7

    const key = Math.random()
    const code = ''
    const style = {
      opacity: 1,
      top: posY + 'px',
      left: posX + 'px',
      fontSize: size + 'px',
      lineHeight: size + 'px',
    }

    const data = { style, code, key }

    setTimeout(() => objects.value.push(data), 1000 * delay)
  }

  const updateCode = (obj: Code) => {
    const { posX, posY } = getPos(obj.style.left)
    obj.code = ''
    obj.key = Math.random()
    obj.style.opacity = 1
    obj.style.top = posY + 'px'
    obj.style.left = posX
  }

  intervalId.value = setInterval(() => {
    objects.value.forEach((obj, index, arr) => {
      const { code } = arr[index]

      if (code.length > 30) return updateCode(obj)
      if (code.length > 10) obj.style.opacity = 0

      obj.code = code + getChar()
    })
  }, 100)
})

onUnmounted(() => {
  if (intervalId.value) clearInterval(intervalId.value)
})
</script>

<style lang="scss" scoped>
#matrix-code {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  @include unSelectable;

  .code {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    position: absolute;
    color: $matrix4;
    width: 1px;
    transform: scale(-1, 1);
    font-weight: bold;
    transition: opacity 2s ease-out;

    .charactor {
      text-shadow:
        2px 0px 3px $matrix3,
        -2px 0px 3px $matrix3,
        0px -2px 3px $matrix3;
    }

    .charactor:nth-last-child(3) {
      color: #9f9;
    }

    .charactor:nth-last-child(2) {
      color: #bfb;
    }

    .charactor:last-child {
      color: #fff;
    }
  }
}
</style>
