<template>
  <div ref="outerContainer" class="app-accordion">
    <transition
      :appear="props.appear"
      @beforeEnter="beforeEnter"
      @enter="enter"
      @afterEnter="afterEnter"
      @beforeLeave="beforeLeave"
      @leave="leave"
    >
      <div v-show="isOpen" ref="innerContainer">
        <slot />
      </div>
    </transition>
  </div>
  <!-- <teleport to="#layer-0">
    <div ref="sandbox" class="sandbox" />
  </teleport> -->
</template>

<script lang="ts" setup>
import { ACCORDION_TRANSITION_MS } from '@/constants/ui'

const props = withDefaults(defineProps<{
  isOpen: boolean
  appear?: boolean
}>(), {
  appear: false,
})

const outerContainer = ref() as Ref<HTMLElement>
const innerContainer = ref() as Ref<HTMLElement>

const beforeEnter = (el: Element) => {
  // 初期状態：サイズを0に設定
  const htmlEl = el as HTMLElement
  htmlEl.style.width = '0'
  htmlEl.style.height = '0'
  htmlEl.style.overflow = 'hidden'
}

const enter = (el: Element) => {
  if (document) {
    const { width, height } = getSize()
    setSize(el, width, height)
  } else {
    setSize(el, 'auto')
  }
}

const afterEnter = (el: Element) => {
  const htmlEl = el as HTMLElement
  htmlEl.style.width = 'auto'
  htmlEl.style.height = 'auto'
  htmlEl.style.overflow = ''
}

const beforeLeave = (el: Element) => {
  // 閉じる前に現在のサイズを設定（トランジションのため）
  if (document) {
    const { width, height } = getSize()
    const htmlEl = el as HTMLElement
    htmlEl.style.width = width
    htmlEl.style.height = height
    htmlEl.style.overflow = 'hidden'
  }
}

const leave = (el: Element) => {
  setSize(el, '0')
}

const setSize = (el: Element, width: string, height?: string) => {
  const { style } = el as HTMLElement
  style.width = width
  style.height = height ?? width
}

/**
 * 要素の実際のサイズを取得
 * MEMO: enter時に取得されるscrollWidthがpadding-rightを含まないため、
 *       複製した要素で正確なscroll(Width/Height)を取得している。
 */
const getSize = (): { width: string, height: string } => {
  if (!document || !innerContainer.value) {
    return { width: 'auto', height: 'auto' }
  }

  const { width, height } = measureElementSize(innerContainer.value)
  const maxWidth = Math.max(outerContainer.value?.scrollWidth || 0, width)

  return {
    width: `${maxWidth}px`,
    height: `${height}px`
  }
}

/**
 * サンドボックス内で要素のサイズを測定
 */
const measureElementSize = (element: HTMLElement): { width: number, height: number } => {
  const clone = element.cloneNode(true) as HTMLElement
  clone.style.width = 'auto'
  clone.style.height = 'auto'

  const sandbox = createSandbox()
  sandbox.appendChild(clone)
  document.body.appendChild(sandbox)

  const { scrollWidth, scrollHeight } = clone

  document.body.removeChild(sandbox)

  return {
    width: scrollWidth,
    height: scrollHeight
  }
}

/**
 * サンドボックス要素を作成
 */
const createSandbox = (): HTMLElement => {
  const sandbox = document.createElement('div')
  sandbox.style.position = 'absolute'
  sandbox.style.visibility = 'hidden'
  sandbox.style.pointerEvents = 'none'
  return sandbox
}

// // MEMO: enter時に取得されるscrollWidthがpadding-rightを含まないため、
// //   ->: 複製した要素で正確なscroll(Width/Height)を取得している。
// const getSize = (): { width: string, height: string } => {
//   const clone = createClone()
//   const sandbox = createSandbox()

//   sandbox.appendChild(clone)
//   document.body.appendChild(sandbox)
//   // return new Promise((resolve) => {
//   //   setTimeout(() => {
//   //     const { scrollWidth, scrollHeight } = clone
//   //     sandbox.value.removeChild(clone)
//   //     resolve({ width: scrollWidth + 'px', height: scrollHeight + 'px' })
//   //   }, 0)
//   // })
//   const { scrollWidth, scrollHeight } = clone
//   // document.body.removeChild(sandbox)
//   return { width: (scrollWidth + 20) + 'px', height: scrollHeight + 'px' }
// }

// const createClone = () => {
//   const clone = outerContainer.value.cloneNode(true) as HTMLElement
//   setSize(clone, 'auto')
//   return clone
// }

// const createSandbox = () => {
//   const sandbox = document.createElement('div')
//   sandbox.style.position = 'absolute'
//   return sandbox
// }
</script>

<style lang="scss" scoped>
.app-accordion {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

// .sandbox {
//   position: absolute;
// }

.v-enter-active,
.v-leave-active {
  transition: all calc(v-bind(ACCORDION_TRANSITION_MS) * 1ms) ease-out !important;
}

.v-leave-to,
.v-enter-from {
  opacity: 0;
}

.v-enter-to,
.v-leave-from {
  opacity: 1;
}
</style>
