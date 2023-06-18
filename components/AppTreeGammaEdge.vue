<script lang="ts" setup>
import { Ref } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

import type { TreeData, TreeState } from '@/composables/useTree'
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
  (event: 'move', e: Event): void
  (event: 'moveItem', payload: MoveProps): void
  (event: 'touchItem', treeData: TreeData): void
  (event: 'changeOpen', payload: TreeData): void
}>()

const treeState = useState('treeState') as Ref<TreeState>

const sensor = computed(() => treeState.value.display.sensors)

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

<template>
  <VueDraggableNext
    tag="ul"
    class="app-tree-edge"
    :class="{ is_alpha: sensor === 'lifeforms' }"
    v-bind="dragEdgeOptions"
    :data-id="treeData.id"
    :on-change="dragEventListener.change"
    @choose="dragEventListener.choose"
    @unchoose="dragEventListener.unchoose"
    @end="handleDragEnd"
  >
    <AppTreeGammaNode
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

<style lang="scss" scoped>
* {
  transition: all 1s ease-out;
}

.app-tree-edge {
  // max-width: 100%;
  height: 100%;
  margin: 0px 0px 0px 10px;
  // border: 1px dotted red;

  position: relative;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  box-sizing: border-box;
  // display: block;
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
