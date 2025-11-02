import { computed, type ComputedRef } from 'vue'
import type { TreeData } from '@/composables/useTree'
import useEvent from '@/composables/useEvent'

interface UseTreeNodeEventsParams {
  toggleOpen: () => void
  amIDragging: ComputedRef<boolean>
  onTouchItem: (treeData: TreeData) => void
  treeData: TreeData
}

export function useTreeNodeEvents({
  toggleOpen,
  amIDragging,
  onTouchItem,
  treeData,
}: UseTreeNodeEventsParams) {
  const { mouseTouchEvent } = useEvent()

  const eventListeners = computed(() => ({
    list: {
      [`${mouseTouchEvent.value.CLICK}Passive`](e: Event) {
        e.stopPropagation()
        const target = e.target as HTMLElement
        const srcElement = e.srcElement as HTMLElement
        if (
          target === srcElement &&
          !target.classList.contains('app-tree-item')
        ) {
          toggleOpen()
        }
      },
      choose() {
        console.log('move')
      },
    },
    item: {
      [`${mouseTouchEvent.value.CLICK}`](e: Event) {
        e.stopPropagation()
        e.preventDefault()
      },
      [`${mouseTouchEvent.value.START}Capture`](e: Event) {
        e.stopPropagation
        e.preventDefault
      },
      [`${mouseTouchEvent.value.MOVE}Capture`](e: Event) {
        e.stopPropagation
        e.preventDefault
      },
      [`${mouseTouchEvent.value.END}Capture`](e: Event) {
        e.stopPropagation
        if (amIDragging.value) return
        onTouchItem(treeData)
      },
    },
  }))

  return {
    eventListeners,
  }
}
