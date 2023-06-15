import { reactive } from 'vue'

import type { MouseTouch } from '@/types/events'

import useWindow from './useWindow'

import useEvent from '@/composables/useEvent'

const WEIGHT = '11px'       // 通常時の太さ
const LENGTH = '100%'       // 通常時の長さ
const OFFSET = '-6px'       // 通常時の太さに応じた位置調整
const STRIDE = '0px'        // 通常時の長さに応じた位置調整
const BOX_WEIGHT = '27px'   // 通常時のコーナーサイズ
const BOX_OFFSET = '-14px'  // 通常時のコーナーサイズに応じた位置調整

type Arguments = {
  el: HTMLElement
  minWidth?: number
  minHeight?: number
}

type EventHandler = (e: MouseTouch) => void

type State = {
  eventHandler: EventHandler
}

// 全リサイザーの設定(型定義)
type ResizerSettings = {
  [key: string]: {
    style: {
      [key: string]: string
    }
    eventHandler: EventHandler
  }
}

// 全リサイザー(型定義)
type Resizers = {
  [key: string]: Resizer
}

// リサイザー(型定義)
type Resizer = HTMLDivElement & {
  style: {
    [key: string]: any
  }
}

/**
 * // リサイズを可能にするハンドル要素を返す
 * @param {object} el         // リサイズ対象のHTML要素
 * @param {number} minWidth   // 横幅の最小値
 * @param {number} minHeight  // 高さの最小値
 * @returns {object}          // ハンドル要素
 */
export default function useResizable({ el, minWidth = 0, minHeight = 0 }: Arguments) {
  const {
    frameX,
    frameY,
    elementState,
    eventState,
    setElementState,
    setEventState,
    replaceMargin,
  } = useWindow(el)

  const { mouseTouchEvent } = useEvent()

  const state: State = reactive({
    eventHandler: (e: MouseTouch) => void(e),
  })

  // イベントを追加する関数
  const addResizeEvent = () => {
    if (!document) return
    const eventHandler = state.eventHandler as EventListener
    document.body.addEventListener(mouseTouchEvent.value.MOVE, eventHandler)
    document.body.addEventListener(mouseTouchEvent.value.END, removeResizeEvent)
  }
  // イベントを削除する関数
  const removeResizeEvent = () => {
    if (!document) return
    const eventHandler = state.eventHandler as EventListener
    document.body.removeEventListener(mouseTouchEvent.value.MOVE, eventHandler)
    document.body.removeEventListener(mouseTouchEvent.value.END, removeResizeEvent)
  }

  // リサイズ後の値を計算する関数
  const getNewTop    = (e: MouseTouch) => e.pageY - frameY.value
  const getNewLeft   = (e: MouseTouch) => e.pageX - frameX.value
  const getNewWidth  = (e: MouseTouch, dir: number) => elementState.value.offsetWidth + dir * (eventState.value.pageX - e.pageX)
  const getNewHeight = (e: MouseTouch, dir: number) => elementState.value.offsetHeight + dir * (eventState.value.pageY - e.pageY)

  /**
   * 垂直方向の位置を更新する関数
   * @param e   eventObject
   */
  const updateTop  = (e: MouseTouch) => el.style.top = getNewTop(e) + 'px'

  /**
   * 水平方向の位置を更新する関数
   * @param e   eventObject
   */
  const updateLeft = (e: MouseTouch) => el.style.left = getNewLeft(e) + 'px'

  /**
   * 横幅を更新する関数
   * @param e    eventObject
   * @param dir  方向(1 or -1)
   * @return     true(更新時) or false(無更新時)
   */
  const updateWidth  = (e: MouseTouch, dir: number): boolean => {
    const newWidth = getNewWidth(e, dir)

    if (minWidth <= newWidth) {
      el.style.width = newWidth + 'px'
      return true
    } else {
      return false
    }
  }

  /**
   * 高さを更新する関数
   * @param {Object} e    eventObject
   * @param {Number} dir  方向(1 or -1)
   * @return {Boolean}    true(更新時) or false(無更新時)
   */
  const updateHeight = (e: MouseTouch, dir: number): boolean => {
    const newHeight = getNewHeight(e, dir)

    if (minHeight <= newHeight) {
      el.style.height = newHeight + 'px'
      return true
    } else {
      return false
    }
  }

  // 全リサイザーの設定
  const resizerSettings: ResizerSettings = {
    // 上辺
    resizerTop: {
      style: {
        top   : OFFSET,
        left  : STRIDE,
        width : LENGTH,
        height: WEIGHT,
        cursor: 'ns-resize',
      },
      eventHandler: (e: MouseTouch) => {
        updateHeight(e, 1) && updateTop(e)
      },
    },
    // 左辺
    resizerLeft: {
      style: {
        top   : STRIDE,
        left  : OFFSET,
        width : WEIGHT,
        height: LENGTH,
        cursor: 'ew-resize',
      },
      eventHandler: (e: MouseTouch) => {
        updateWidth(e, 1) && updateLeft(e)
      },
    },
    // 右辺
    resizerRight: {
      style: {
        top   : STRIDE,
        right : OFFSET,
        width : WEIGHT,
        height: LENGTH,
        cursor: 'ew-resize',
      },
      eventHandler: (e: MouseTouch) => {
        updateWidth(e, -1)
      },
    },
    // 下辺
    resizerBottom: {
      style: {
        bottom: OFFSET,
        left  : STRIDE,
        width : LENGTH,
        height: WEIGHT,
        cursor: 'ns-resize',
      },
      eventHandler: (e: MouseTouch) => {
        updateHeight(e, -1)
      },
    },
    // 左上
    resizerTopLeft: {
      style: {
        top   : BOX_OFFSET,
        left  : BOX_OFFSET,
        width : BOX_WEIGHT,
        height: BOX_WEIGHT,
        cursor: 'nwse-resize',
      },
      eventHandler: (e: MouseTouch) => {
        updateWidth(e, 1) && updateLeft(e)
        updateHeight(e, 1) && updateTop(e)
      },
    },
    // 右上
    resizerTopRight: {
      style: {
        top   : BOX_OFFSET,
        right : BOX_OFFSET,
        width : BOX_WEIGHT,
        height: BOX_WEIGHT,
        cursor: 'nesw-resize',
      },
      eventHandler: (e: MouseTouch) => {
        updateWidth(e, -1)
        updateHeight(e, 1) && updateTop(e)
      },
    },
    // 左下
    resizerBottomLeft: {
      style: {
        bottom: BOX_OFFSET,
        left  : BOX_OFFSET,
        width : BOX_WEIGHT,
        height: BOX_WEIGHT,
        cursor: 'nesw-resize',
      },
      eventHandler: (e: MouseTouch) => {
        updateHeight(e, -1)
        updateWidth(e, 1) && updateLeft(e)
      },
    },
    // 右下
    resizerBottomRight: {
      style: {
        bottom: BOX_OFFSET,
        right : BOX_OFFSET,
        width : BOX_WEIGHT,
        height: BOX_WEIGHT,
        cursor: 'nwse-resize',
      },
      eventHandler: (e: MouseTouch) => {
        updateWidth(e, -1)
        updateHeight(e, -1)
      },
    },
  }

  // 全リサイザー
  const resizers: Resizers = {}

  for (const name of Object.keys(resizerSettings)) {
    const { style, eventHandler } = resizerSettings[name]

    const resizer: Resizer = document.createElement('div')

    // リサイザーのスタイルを設定する
    for (const prop of Object.keys(style)) {
      resizer.style[prop] = style[prop]
      resizer.style.position = 'absolute'
      // resizer.style.background = 'rgba(100,100,255,0.5)' // デバッグ用
    }

    // リサイザーのイベントハンドラを設定する
    resizer.addEventListener(mouseTouchEvent.value.START, ((e: MouseTouch) => {
      state.eventHandler = eventHandler
      setElementState()
      setEventState(e)
      replaceMargin()
      addResizeEvent()
    }) as EventListener)

    // resizerSettingsと同じプロパティでresizersに登録する
    resizers[name] = resizer
  }

  return { ...resizers }
}
