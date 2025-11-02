import { computed, type ComputedRef, type Ref } from 'vue'
import type { TreeData } from '@/composables/useTree'
import type { DragState } from '@/composables/useDraggableNext'

/**
 * TreeNodeコンポーネントで共通して使用されるロジック
 */
export function useTreeNodeLogic(params: {
  treeData: Ref<TreeData>
  dragState: Ref<DragState>
  isDragging: Ref<boolean>
  emit: (event: 'changeOpen', payload: TreeData) => void
}) {
  const { treeData, dragState, isDragging, emit } = params

  /**
   * children以外のプロパティを取得
   */
  const itemProps = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, ...other } = treeData.value
    return other
  })

  /**
   * 自分がドラッグ中かどうか
   */
  const amIDragging = computed(() => dragState.value.draggingID === treeData.value.id)

  /**
   * 何かがドラッグ中かどうか（自分または他のアイテム）
   */
  const isSomeDragging = computed(() => isDragging.value || amIDragging.value)

  /**
   * リンクが設定されているかどうか
   */
  const isLink = computed(() => treeData.value.link)

  /**
   * 子要素を持つかどうか
   */
  const isParent = computed(() => 0 < treeData.value.children.length)

  /**
   * 子要素が開いているかどうか
   */
  const isChildrenOpen = computed({
    get: () => !!treeData.value.opened,
    set: () => emit('changeOpen', itemProps.value),
  })

  /**
   * 開閉をトグルする
   */
  const toggleOpen = () => (isChildrenOpen.value = !isChildrenOpen.value)

  return {
    itemProps,
    amIDragging,
    isSomeDragging,
    isLink,
    isParent,
    isChildrenOpen,
    toggleOpen,
  }
}
