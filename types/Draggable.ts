// 可能であるDnDの状態
export const DRAG_MODE = {
  LOCK: 'EDIT',
  NODE: 'MARK',
  EDGE: 'MOVE',
} as const

// 可能であるDnDの状態（こちらは型）
export type DragMode = typeof DRAG_MODE[keyof typeof DRAG_MODE]

// DnDの対象となる要素には"data-id"属性があるものとする
export type DraggableElement = HTMLElement & {
  dataset: {
    id: string
  }
}

// VueDraggableNextのイベントオブジェクト
export type CustomDragEvent = DragEvent & {
  to: DraggableElement
  from: DraggableElement
  item: DraggableElement
  newIndex: number
  oldIndex: number
}
