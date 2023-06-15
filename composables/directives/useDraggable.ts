import type { MouseTouch } from '@/types/events'

import useWindow from './useWindow'

import useEvent from '@/composables/useEvent'

export default function useDraggable(el: HTMLElement) {
  const {
    frameX,
    frameY,
    setElementState,
    setEventState,
    replaceMargin,
  } = useWindow(el)

  const { mouseTouchEvent } = useEvent()

  // 状態をドラッグ後の値で更新する関数
  const drag = (e: MouseTouch) => {
    el.style.top = ((e.pageY ?? e.touches[0].pageY) - frameY.value) + 'px'
    el.style.left = ((e.pageX ?? e.touches[0].pageX) - frameX.value) + 'px'
  }

  // イベントを追加する関数
  const addDragEvent = () => {
    if (!document) return
    document.body.addEventListener(mouseTouchEvent.value.MOVE, drag as EventListener)
    document.body.addEventListener(mouseTouchEvent.value.END, removeDragEvent)
  }

  // イベントを削除する関数
  const removeDragEvent = () => {
    if (!document) return
    document.body.removeEventListener(mouseTouchEvent.value.MOVE, drag as EventListener)
    document.body.removeEventListener(mouseTouchEvent.value.END, removeDragEvent)
  }

  // ハンドル要素にイベントを追加する関数
  const addDragEvent2Handle = (handle: HTMLElement) => {
    if (!handle) return
    handle.addEventListener(mouseTouchEvent.value.START, ((e: MouseTouch) => {
      if (e.target !== e.currentTarget) return
      setElementState()
      setEventState(e)
      replaceMargin()
      addDragEvent()
    }) as EventListener)
  }

  return { addDragEvent2Handle }
}
