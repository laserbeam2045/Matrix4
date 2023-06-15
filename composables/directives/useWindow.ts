import { Ref, reactive, computed } from 'vue'
import { MouseTouch } from '@/types/events'

type ElementState = {
  offsetParent: HTMLElement | Element | null
  offsetTop   : number
  offsetLeft  : number
  offsetWidth : number
  offsetHeight: number
  clientWidth : number
  clientHeight: number
}

type EventState = {
  screenX: number
  screenY: number
  clientX: number
  clientY: number
  pageX  : number
  pageY  : number
}

export default function useWindow(el: HTMLElement) {

  // elementが持つプロパティの状態
  const elementState = useState('elementState', () => {
    return reactive({
      offsetParent: null, // 直近の祖先(CSS-positioned)要素
      offsetTop   : 0,    // offsetParentから見た垂直位置
      offsetLeft  : 0,    // offsetParentから見た水平位置
      offsetWidth : 0,    // padding, borderを含む幅
      offsetHeight: 0,    // padding, borderを含む高さ
      clientWidth : 0,    // paddingを含む幅
      clientHeight: 0,    // paddingを含む高さ
    })
  }) as Ref<ElementState>

  // eventが持つプロパティの状態
  const eventState = useState('eventState', () => {
    return reactive({
      screenX: 0,   // 端末のスクリーンを起点とした水平位置
      screenY: 0,   // 端末のスクリーンを起点とした垂直位置
      clientX: 0,   // viewportの左上からの水平位置
      clientY: 0,   // viewportの左上からの垂直位置
      pageX  : 0,   // page全体の左上からの水平位置
      pageY  : 0,   // page全体の左上からの垂直位置
    })
  }) as Ref<EventState>

  // (水平・垂直)位置のピクセル数値(el要素内での、相対位置)
  const frameX = computed(() => eventState.value.pageX - elementState.value.offsetLeft)
  const frameY = computed(() => eventState.value.pageY - elementState.value.offsetTop)

  const setElementState = () => {
    elementState.value.offsetParent = el.offsetParent
    elementState.value.offsetTop = el.offsetTop
    elementState.value.offsetLeft = el.offsetLeft
    elementState.value.offsetWidth = el.offsetWidth
    elementState.value.offsetHeight = el.offsetHeight
    elementState.value.clientWidth = el.clientWidth
    elementState.value.clientHeight = el.clientHeight
  }

  const setEventState = (e: MouseTouch) => {
    eventState.value.screenX = e.screenX ?? e.touches[0].screenX
    eventState.value.screenY = e.screenY ?? e.touches[0].screenY
    eventState.value.clientX = e.clientX ?? e.touches[0].clientX
    eventState.value.clientY = e.clientY ?? e.touches[0].screenY
    eventState.value.pageX = e.pageX ?? e.touches[0].pageX
    eventState.value.pageY = e.pageY ?? e.touches[0].pageY
  }

  // マージンをなくし、絶対位置で置き換える関数
  const replaceMargin = () => {
    el.style.margin = '0px'
    el.style.top = elementState.value.offsetTop + 'px'
    el.style.left = elementState.value.offsetLeft + 'px'
  }

  return {
    frameX,
    frameY,
    setElementState,
    setEventState,
    replaceMargin,
    elementState: readonly(elementState),
    eventState: readonly(eventState),
  }
}
