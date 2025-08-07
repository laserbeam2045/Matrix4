import { ComputedRef, reactive, computed } from 'vue'
import Sortable from 'sortablejs'

import { CustomDragEvent } from '@/types/Draggable'
import { DRAG_EVENT } from '@/utilities/v_event_functions'

type Options = Sortable.SortableOptions

export type DragState = {
  draggingID: string | null
  locked: boolean
  observed: boolean
  countable: boolean
  counterID: NodeJS.Timeout | null
  observeID: NodeJS.Timeout | null
  counter: {
    generation: number
    x: number | null
    y: number | null
  }
}

export type DragEventListener = {
  change: (e: CustomDragEvent) => void
  choose: () => void
  unchoose: () => void
}

// 一回の移動にかける時間（ms）
const animation = 200

const UNLOCK_THRESHOLD = 3

// デフォルトのセッティング
const defaultSettings: Options = Object.freeze({
  group: 'name',                      // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
  sort: true,                         // sorting inside list
  delay: 0,                           // time in milliseconds to define when the sorting should start
  delayOnTouchOnly: false,            // only delay if user is using touch
  touchStartThreshold: 8,             // px, how many pixels the point should move before cancelling a delayed drag event
  disabled: false,                    // Disables the sortable if set to true.
  // store: null,                     // @see Store
  animation,                          // ms, animation speed moving items when sorting, `0` — without animation
  easing: 'ease',              // Easing for animation. Defaults to null. See https://easings.net/ for examples.
  handle: '.app-tree-item',           // Drag handle selector within list items
  filter: '.ignore-elements',         // Selectors that do not lead to dragging (String or Function)
  preventOnFilter: true,              // Call `event.preventDefault()` when triggered `filter`
  // draggable: '.item',                 // Specifies which items inside the element should be draggable
  dataIdAttr: 'data-id',          // HTML attribute that is used by the `toArray()` method
  ghostClass: 'sortable-ghost',   // Class name for the drop placeholder
  chosenClass: 'sortable-chosen', // Class name for the chosen item
  dragClass: 'sortable-drag',     // Class name for the dragging item
  swapThreshold: 0.5,         // Threshold of the swap zone
  invertSwap: false,        // Will always use inverted swap zone if set to true
  invertedSwapThreshold: 1, // Threshold of the inverted swap zone (will be set to swapThreshold value by default)
  direction: 'horizontal',  // Direction of Sortable (will be detected automatically if not given)
  forceFallback: true,               // ignore the HTML5 DnD behaviour and force the fallback to kick in
  fallbackClass: 'sortable-fallback', // Class name for the cloned DOM Element when using forceFallback
  fallbackOnBody: true,              // Appends the cloned DOM Element into the Document's Body
  fallbackTolerance: 32,               // Specify in pixels how far the mouse should move before it's considered as a drag.
  dragoverBubble: false,
  removeCloneOnHide: true, // Remove the clone element when it is not showing, rather than just hiding it
  emptyInsertThreshold: 1, // px, distance mouse must be from empty sortable to insert drag element into it
})

// VueDraggableNextの設定を扱うモジュール
export default function useDraggable(
  overrideOptions: ComputedRef<Options>
): {
  dragState: DragState
  draggableOptions: ComputedRef<Options>
  dragEventListener: DragEventListener
} {

  const dragState = reactive<DragState>({
    draggingID: null,
    locked: false,
    observed: false,
    countable: false,
    counterID: null,
    observeID: null,
    counter: {
      generation: 0,
      x: null,
      y: null,
    },
  })

  const resetObserve = () => {
    dragState.observed = true
    dragState.countable = false
    dragState.counterID = setTimeout(() => dragState.countable = true, animation - 100)
    dragState.observeID = setTimeout(dragendHandler, animation)
  }

  const unObserve = () => {
    dragState.observed = false
    dragState.countable = false
    if (dragState.counterID) clearTimeout(dragState.counterID)
    if (dragState.observeID) clearTimeout(dragState.observeID)
  }

  const resetCounter = () => {
    dragState.counter.generation++
    dragState.counter.x = null
    dragState.counter.y = null
  }

  const lock = () => {
    const { generation } = dragState.counter
    console.log(`%c(${generation}) lock`, 'color: red')
    dragState.locked = true
  }

  const unlock = () => {
    const { generation } = dragState.counter
    console.log(`%c(${generation}) unlock`, 'color: blue')
    dragState.locked = false
  }

  const L1Norm = ({ x, y }: { x: number, y: number }) => {
    if (dragState.counter.x === null || dragState.counter.y === null) {
      dragState.counter.x = x
      dragState.counter.y = y
    }
    return Math.abs(dragState.counter.x - x) + Math.abs(dragState.counter.y - y)
  }

  // drag イベント時の処理
  const dragHandler = (e: DragEvent | TouchEvent) => {
    const { pageX: x } = 'touches' in e ? e.touches[0] : e
    const { pageY: y } = 'touches' in e ? e.touches[0] : e
    dragState.countable && UNLOCK_THRESHOLD <= L1Norm({ x, y }) && dragendHandler()
  }

  // dragend イベント時の処理
  const dragendHandler = () => {
    window.removeEventListener(DRAG_EVENT.DRAGGING, dragHandler)
    window.removeEventListener(DRAG_EVENT.DRAG_END, dragendHandler)
    unObserve()
    unlock()
  }

  // dragイベントの監視を開始する処理
  const changeListener = (e: CustomDragEvent) => {
    // if (dragState.observed) return
    // if (e.from === e.to) return

    // resetObserve()
    // resetCounter()
    // lock()
    // window.addEventListener(DRAG_EVENT.DRAGGING, dragHandler)
    // window.addEventListener(DRAG_EVENT.DRAG_END, dragendHandler)
    dragState.draggingID = e.item.dataset.id
  }

  const dragStartListener = () => 1

  const dragEndListener = () => dragState.draggingID = null

  const dragEventListener = {
    change: changeListener,
    choose: dragStartListener,
    unchoose: dragEndListener,
  }

  // DnDに関する設定
  const draggableOptions = computed((): Options => {
    return dragState.locked
      ? { disabled: true }
      : {
        ...defaultSettings,
        ...overrideOptions.value,
      }
  })

  return {
    dragState,
    draggableOptions,
    dragEventListener,
  }
}
