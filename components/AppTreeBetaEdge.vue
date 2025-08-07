<template>
  <VueDraggableNext
    tag="ul"
    class="app-tree-edge"
    :class="{ is_alpha: false }"
    v-bind="dragEdgeOptions"
    :data-id="treeData.id"
    :on-change="dragEventListener.change"
    @choose="dragEventListener.choose"
    @unchoose="dragEventListener.unchoose"
    @end="handleDragEnd"
  >
    <AppTreeBetaNode
      v-for="child in treeData.children"
      :key="child.id"
      :tree-data="child"
      :drag-mode="dragMode"
      :drag-state="dragState"
      :item-component="itemComponent"
      :drag-node-options="dragNodeOptions"
      :drag-edge-options="dragEdgeOptions"
      :drag-event-listener="dragEventListener"
      :is-parent-open="isParentOpen"
      :is-dragging="isDragging"
      @moveItem="$emit('moveItem', $event)"
      @touchItem="$emit('touchItem', $event)"
      @changeOpen="$emit('changeOpen', $event)"
    />
  </VueDraggableNext>
</template>

<script lang="ts" setup>
import { VueDraggableNext } from 'vue-draggable-next'

import type { TreeData } from '@/composables/useTree'
import type { DragMode, CustomDragEvent } from '@/types/Draggable'
import type { DragEventListener, DragState } from '@/composables/useDraggableNext'

defineProps<{
  treeData: TreeData
  itemComponent: object
  dragNodeOptions: object
  dragEdgeOptions: object
  dragEventListener: DragEventListener
  isParentOpen: boolean
  isDragging: boolean
  dragState: DragState
  dragMode: DragMode
}>()

type MoveProps = {
  cID: string
  pID: string
  idx: number
}

const emit = defineEmits<{
  'move': [e: Event]
  'moveItem': [payload: MoveProps]
  'touchItem': [treeData: TreeData]
  'changeOpen': [payload: TreeData]
}>()

// ノードの移動イベントハンドラ
const handleDragEnd = (e: CustomDragEvent) => {
  const { to, from, newIndex, oldIndex, item } = e

  // 所属グループ、または、順番が変更された場合にイベントを発火
  if (to !== from || newIndex !== oldIndex) {
    const cID = item.dataset.id
    const pID = to.dataset.id
    const idx = Number(newIndex)
    emit('moveItem', { cID, pID, idx })
  }
}
</script>

<style lang="scss" scoped>
* {
  transition: all 1s ease-out;
}

.app-tree-edge {
  padding: 19px 8px 8px 0px;
  margin: 0px 0px 0px 0px;
  // border: 1px dotted red;
  // max-width: 400px;

  &:not(.is_alpha) {
    display: inline-flex;
    flex-wrap: wrap;
  }
}

.app-tree-edge {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.v-enter-active,
.v-leave-active {
  transition: all .3s ease-out !important;
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
