import { isRef, unref } from 'vue'

/* DOMの操作に関する関数 */

// 第一引数から見て直近の、第二引数の条件を満たす祖先要素を返す関数
export const getClosestElement = (element: HTMLElement, conditionFunc: any, limit = 30) => {
  for (let i = 0; i <= limit; i++) {
    if (!element.parentElement) {
      return null
    }
    element = element.parentElement
    if (conditionFunc(element)) {
      return element
    } else if (element === null) {
      console.error('Component could not find element.')
      return null
    }
  }
}

// 第一引数がHTML要素かどうかを返す関数
export const isElement = (obj: any) => {
  try {
    return obj instanceof HTMLElement
  } catch (e) {
    return (
      (typeof obj === 'object') &&
      (obj.nodeType === Node.ELEMENT_NODE) &&
      (typeof obj.style === 'object') &&
      (typeof obj.ownerDocument === 'object')
    )
  }
}

// rootを持つコンポーネントが渡される場合を想定している
const getRootOrEl = (obj: any) => ('root' in obj) ? unref(obj.root) : obj.$el

// ルートのHTML要素を得る糖衣構文
export const getRootElement = (obj: any) => {
  if (isElement(obj))  return obj
  else if (isRef(obj)) return getRootOrEl(unref(obj))
  else                 return getRootOrEl(obj)
}
