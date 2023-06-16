/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineNuxtPlugin } from '#app'
import useEvent from '@/composables/useEvent'
import useDraggable from '@/composables/directives/useDraggable'
import useResizable from '@/composables/directives/useResizable'

export default defineNuxtPlugin(nuxtApp => {
  const { mouseTouchEvent } = useEvent()

  /**
   * position: absoluteで中央配置にする
   * v-center             縦横中央配置
   * v-center:vertical    上下中央配置
   * v-center:horizontal  左右中央配置
   */
  nuxtApp.vueApp.directive('center', {
    mounted(el, { arg, value }) {
      if (!document) return
      const doc = document.documentElement
      el.style.position = value?.position ?? 'absolute'

      if (arg === 'vertical' || !arg) {
        const top = Math.floor((doc.offsetHeight - el.offsetHeight * (value?.offset ?? 1.5)) / 2)
        el.style.top = top + 'px'
      }
      if (arg === 'horizontal' || !arg) {
        const left = Math.floor((doc.offsetWidth - el.offsetWidth) / 2)
        el.style.left = left + 'px'
      }
    },
  })

  /**
   * position: fixedで固定する
   * v-pin:[direction]="pinPadding"
   */
  nuxtApp.vueApp.directive('pin', {
    mounted(el, { arg, value }) {
      const s = arg || 'top'
      el.style[s] = value + 'px'
      el.style.position = 'fixed'
    },
  })

  /**
   * elementのドラッグ移動を可能にする
   * v-draggable
   */
  nuxtApp.vueApp.directive('draggable', {
    mounted(el, { value }) {
      const handleSelector = '.draggable-handle'
      const { addDragEvent2Handle } = useDraggable(el)

      el.style.position = value?.position ?? 'absolute';
      (el as HTMLElement).querySelectorAll<HTMLElement>(handleSelector)
        .forEach((handle: HTMLElement) => {
          handle.style.cursor = 'grab'
          addDragEvent2Handle(handle)
        })
    },
  })

  /**
   * HTMLElementのリサイズを可能にする
   * v-resizable:all        全方向
   * v-resizable:vertical   上下だけ
   * v-resizable:horizontal 左右だけ
   * v-resizable:diagonal   斜めだけ
   */
  nuxtApp.vueApp.directive('resizable', {
    mounted(el, { arg }) {
      if (!document || !arg) return

      const {
        resizerTop,
        resizerLeft,
        resizerRight,
        resizerBottom,
        resizerTopLeft,
        resizerTopRight,
        resizerBottomLeft,
        resizerBottomRight,
      } = useResizable({ el })

      // el.style.position = 'absolute'

      console.table({ arg })

      if (arg === 'vertical' || arg === 'all') {
        el.appendChild(resizerTop)
        el.appendChild(resizerBottom)
      }
      if (arg === 'horizontal' || arg === 'all') {
        el.appendChild(resizerLeft)
        el.appendChild(resizerRight)
      }
      if (arg === 'diagonal' || arg === 'all') {
        el.appendChild(resizerTopLeft)
        el.appendChild(resizerTopRight)
        el.appendChild(resizerBottomLeft)
        el.appendChild(resizerBottomRight)
      }
    },
  })

  /**
   * elementのスクロールイベントを感知するディレクティブ
   * v-scroll="callbackFunction"
   */
  nuxtApp.vueApp.directive('scroll', {
    mounted(el, binding) {
      const fn = (evt: Event) => {
        if (binding.value && binding.value(evt, el)) {
          el.removeEventListener('scroll', fn)
        }
      }
      el.addEventListener('scroll', fn)
    },
  })

  /**
   * elementのresize(イベントではない)を感知するディレクティブ
   * v-resize="callbackFunction"
   */
  nuxtApp.vueApp.directive('resize', {
    mounted(el, binding) {
      const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
          if (binding.value && binding.value(entry.target)) {
            resizeObserver.unobserve(entry.target)
          }
        }
      })
      const options = {}
      resizeObserver.observe(el, options)
    },
  })

  /**
   * windowのresizeイベントを感知するディレクティブ
   * v-window-resize="callbackFunction"
   */
  nuxtApp.vueApp.directive('window-resize', {
    mounted(el, binding) {
      const fn = (evt: Event) => {
        if (binding.value && binding.value(evt, el)) {
          window.removeEventListener('resize', fn)
        }
      }
      window.addEventListener('resize', fn)
    },
  })

  /**
   * mount時に自動的にfocusするディレクティブ
   * v-focus[="callbackFunction"]
   */
  nuxtApp.vueApp.directive('focus', {
    mounted(el, binding) {
      const focusable = (el: HTMLElement | any) =>
        ['INPUT', 'TEXTAREA'].includes(el?.tagName ?? '')

      if (focusable(el)) {
        el.focus()
      } else if (el.childNodes.length) {
        el.childNodes.forEach((child: any) => {
          if (focusable(child)) {
            (child as HTMLElement).focus()
          }
        })
      }
      if (binding.value) binding.value(el)
    },
  })

  /**
   * モバイル端末での素早いfocusを可能にするディレクティブ
   * v-quick-focus[="callbackFunction"]
   */
  nuxtApp.vueApp.directive('quick-focus', {
    mounted(el, binding) {
      const focus = (evt: Event) => {
        if (evt.target === el) el.focus()

        if (binding.value && binding.value(evt, el)) {
          el.removeEventListener(mouseTouchEvent.value.START, focus)
          window.removeEventListener(mouseTouchEvent.value.END, blur)
        }
      }

      const blur = (evt: Event) => {
        if (evt.target !== el) el.blur()
      }

      el.addEventListener(mouseTouchEvent.value.START, focus)
      // setTimeout(() => {
      //   window.addEventListener(EVENT.END, blur)
      // }, 500)
    },
  })
})
