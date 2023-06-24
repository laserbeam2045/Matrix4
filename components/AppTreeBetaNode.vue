<template>
  <VueDraggableNext
    tag="fieldset"
    class="app-tree-node"
    :class="{
      parent: isParent,
      is_alpha: false,
      show_line: false,
      show_border: treeData.isGroup || isParent,
      dragging: isSomeDragging,
      treeDragging: dragState.draggingID,
    }"
    :list="[itemProps]"
    :data-id="treeData.id"
    :title="treeData.txt"
    v-bind="dragNodeOptions"
    v-on="eventListeners.list"
  >
    <legend
      class="item-container"
      :data-id="treeData.id"
    >
      <component
        :is="itemComponent"
        class="app-tree-item"
        :class="{ link: isLink, reflect: !(treeData.isGroup || isParent) }"
        :tree-data="treeData"
        v-on="eventListeners.item"
        @touchmove.prevent
      />
    </legend>

    <AppAccordion
      class="edge-container"
      :appear="false"
      :is-open="true"
    >
      <AppTreeBetaEdge
        v-if="treeData.level % 10 || isMounted"
        :tree-data="treeData"
        :drag-mode="dragMode"
        :drag-state="dragState"
        :item-component="itemComponent"
        :drag-node-options="dragNodeOptions"
        :drag-edge-options="dragEdgeOptions"
        :drag-event-listener="dragEventListener"
        :is-parent-open="isParent && isChildrenOpen"
        :is-dragging="isSomeDragging"
        :style="{
          maxWidth: isParent ? `calc(max(30px, 100vw - 10vw) - ${treeData.level * 28}px)` : 'auto',
        }"
        @moveItem="$emit('moveItem', $event)"
        @touchItem="$emit('touchItem', $event)"
        @changeOpen="$emit('changeOpen', $event)"
      />
    </AppAccordion>
  </VueDraggableNext>
</template>

<script lang="ts" setup>
import { VueDraggableNext } from 'vue-draggable-next'

import type { TreeData } from '@/composables/useTree'
import type { DragMode } from '@/types/Draggable'
import type { DragEventListener, DragState } from '@/composables/useDraggableNext'

import useEvent from '@/composables/useEvent'

const props = defineProps<{
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
  (event: 'moveItem', payload: MoveProps): void
  (event: 'touchItem', treeData: TreeData): void
  (event: 'changeOpen', payload: TreeData): void
}>()

const {
  treeData,
  dragState,
  isDragging,
} = toRefs(props)

const itemProps = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children, ...other } = props.treeData
  return other
})

const amIDragging = computed(() => dragState.value.draggingID === treeData.value.id)

const isSomeDragging = computed(() => isDragging.value || amIDragging.value)

const isLink = computed(() => treeData.value.link)

const isParent = computed(() => 0 < treeData.value.children.length)

const isChildrenOpen = computed({
  get: () => !!treeData.value.opened,
  set: () => emit('changeOpen', itemProps.value),
})

const toggleOpen = () => (isChildrenOpen.value = !isChildrenOpen.value)

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
      // emit('touchItem', props.treeData)
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
      emit('touchItem', props.treeData)
    },
  },
}))

const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})
</script>

<style lang="scss" scoped>
* {
  transition: all 1s ease-out;
}

.app-tree-node {
  position: relative;
  flex-shrink: 1;
  background: rgba(0, 170, 170, 0.2);
  // background: $textColor2;
  // background: rgba(0, 108, 108, 1);
  border: 1px solid rgba(0, 255, 255, 1);
  transition: background-color 0.2s, width 2s, height 2s;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  list-style: none;
  outline: none;

  // ベータモード
  &:not(.is_alpha) {
    padding: 8px 8px 0px 8px;
    margin: 24px 0px 0 8px;
    border-radius: 5px;
    text-align: center;

    &[data-level="1"] {
      margin-top: 0;
      margin-left: 0;
    }

    &:not(.parent):not(.show_border) {
      border-color: transparent;
      background-color: transparent;
    }

    &.parent {
      display: block;
      display: grid;
      grid-gap: 8px;
      grid-auto-flow: row;
      grid-template-rows: auto 1fr;
      grid-template-columns: auto auto 1fr auto;
    }
  }

  // Drag前の要素に適用されるスタイル
  // &.sortable-chosen {
  //   background: rgba(255, 255, 255, 0.6);
  // }

  // Drag中の要素に適用されるスタイル
  // &.sortable-ghost {
  //   background: rgba(255, 255, 255, 0.6);
  // }

  &.dragging {
    background: rgba(40, 210, 210, 0.9);
    // border-color: white;
  }

  // Drag中に複製される要素のスタイル
  &.sortable-drag {
    opacity: 0 !important;
  }

  // Drag中に複製される要素のスタイル
  &.sortable-drag > *:nth-child(n + 2),
  &.sortable-drag::before {
    display: none;
  }

  // アイテム要素のラッパー
  .item-container {
    position: relative;
    display: flex;
    align-items: center;
    z-index: 2;
  }

  &.treeDragging > .item-container {
    z-index: 0;
  }

  .toggle-container {
    width: 38px;
    // height: 38px;
    display: flex;
    align-items: center;
    margin: 0 0 0 -4px;
    z-index: 1;
    // border: 1px solid yellow;
  }

  // .blank {
  //   background: blue;
  // }

  .drag-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 0 8px 0 -16px;
    z-index: 2;
    // background: skyblue;
    // border: 1px dotted gold;
  }

  // 子要素のラッパー
  .edge-container {
    // display: flex;
    // align-items: center;
    padding: 0 0 0;
    margin: -27px 0 0 0;
    grid-column: span 4;
    z-index: 1;
    @include unSelectable;
    // background: rgba(230, 20, 30, 0.1);
  }

  // 樹形図の線を表現するための簡易的な手法
  &.show_line:not([data-level="1"])::before {
    content: "";
    position: absolute;
    top: -9973px;
    left: -21px;
    width: 30px;
    height: 10000px;
    color: #ddd;
    border-left: 2px solid;
    border-bottom: 2px solid;
    border-radius: 0 0 0 4px;
    pointer-events: none;
    // transition: opacity .1s;
  }

  &.treeDragging::before {
    opacity: 0;
  }
}
</style>
