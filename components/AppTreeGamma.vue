<script lang="ts" setup>
import useDraggableNext from '@/composables/useDraggableNext'

import type Sortable from 'sortablejs'
import type { TreeData, TreeOptions } from '@/composables/useTree'

import { DRAG_MODE } from '@/types/Draggable'

const props = withDefaults(defineProps<{
  treeData: TreeData | null
  treeOptions: TreeOptions
  itemComponent: object
  displayRoot?: boolean
}>(), {
  displayRoot: true,
  displayMode: 'gamma',
})

type MoveProps = {
  cID: string
  pID: string
  idx: number
}

defineEmits<{
  (event: 'moveItem', payload: MoveProps): void
  (event: 'touchItem', treeData: TreeData): void
  (event: 'changeOpen', payload: TreeData): void
}>()

// DnDに関する設定
const { dragMode: propDragMode } = toRefs(props.treeOptions)

// 親からプロパティを受け取らなかった場合はデフォルト値が設定される
const dragMode = computed(() => propDragMode?.value ?? DRAG_MODE.LOCK)

// ノード単位のDnDに関する設定
const dragNodeSettings = computed<Sortable.SortableOptions>(() => (
  dragMode.value === DRAG_MODE.NODE
    ? {
      group: {
        name: 'nodes',
        pull: 'clone',
        put: false,
      },
      sort: false,
    }
    : { disabled: true }
))

// ブランチ単位のDnDに関する設定
const dragEdgeSettings = computed<Sortable.SortableOptions>(() => (
  dragMode.value === DRAG_MODE.EDGE
    ? {
      group: {
        name: 'edges',
        pull: true,
        put: true,
      },
      draggable: '.app-tree-node',
      handle: '.app-tree-item',
    }
    : { disabled: true }
))

// VueDraggableNextに渡す設定
const {
  draggableOptions: dragNodeOptions,
} = useDraggableNext(dragNodeSettings)

const {
  draggableOptions: dragEdgeOptions,
  dragEventListener,
  dragState,
} = useDraggableNext(dragEdgeSettings)
</script>

<template>
  <div>
    <ul
      v-if="treeData && displayRoot"
      :key="treeData.id"
      class="app-tree"
    >
      <AppTreeGammaNode
        :tree-data="treeData"
        :drag-mode="dragMode"
        :drag-state="dragState"
        :item-component="itemComponent"
        :drag-node-options="dragNodeOptions"
        :drag-edge-options="dragEdgeOptions"
        :drag-event-listener="dragEventListener"
        :is-parent-open="true"
        :is-dragging="false"
        :data-level="1"
        @moveItem="$emit('moveItem', $event)"
        @touchItem="$emit('touchItem', $event)"
        @changeOpen="$emit('changeOpen', $event)"
      />
    </ul>
    <ul
      v-else-if="treeData"
      :key="treeData.id + 'foo'"
      class="app-tree"
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
        :is-parent-open="true"
        :is-dragging="false"
        :data-level="1"
        @moveItem="$emit('moveItem', $event)"
        @touchItem="$emit('touchItem', $event)"
        @changeOpen="$emit('changeOpen', $event)"
      />
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.app-tree {
  // max-width: 100%;
  height: 100%;
  margin: 0px 0px 0px 0px;
  // border: 1px dotted red;

  position: relative;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  box-sizing: border-box;
}
</style>
