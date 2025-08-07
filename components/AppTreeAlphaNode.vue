<template>
  <VueDraggableNext
    tag="li"
    class="app-tree-node"
    :class="{
      parent: isParent,
      is_alpha: true,
      show_line: factions[0] === true,
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
    <div
      class="item-container"
      :data-id="treeData.id"
    >
      <component
        :is="itemComponent"
        class="app-tree-item item"
        :class="{ link: isLink, reflect: false }"
        :tree-data="treeData"
        v-on="eventListeners.item"
        @touchmove.prevent
      />
    </div>

    <AppAccordion
      class="toggle-container"
      :appear="false"
      :is-open="isParent && !isChildrenOpen"
    >
      <ToggleButton :is-open="isChildrenOpen" />
    </AppAccordion>

    <AppAccordion
      class="edge-container"
      :appear="false"
      :is-open="!isParent || isChildrenOpen"
    >
      <AppTreeAlphaEdge
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
          maxWidth: 'auto',
          // maxWidth: sensor === 'economy' ? '94vw' : 'auto',
        }"
        @moveItem="$emit('moveItem', $event)"
        @touchItem="$emit('touchItem', $event)"
        @changeOpen="$emit('changeOpen', $event)"
      />
    </AppAccordion>
  </VueDraggableNext>
</template>

<script lang="ts" setup>
import { Ref } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'

import type { TreeData, TreeState } from '@/composables/useTree'
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
  'moveItem': [payload: MoveProps]
  'touchItem': [treeData: TreeData]
  'changeOpen': [payload: TreeData]
}>()

const {
  treeData,
  dragState,
  isDragging,
} = toRefs(props)

const treeState = useState('treeState') as Ref<TreeState>

const factions = computed(() => treeState.value.display.factions)

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
  flex-shrink: 0;
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

  // アルファモード
  &.is_alpha {
    padding: 8px 0px 0px 8px;
    margin: 0px 0 0 20px;
    display: grid;
    grid-gap: 8px;
    grid-auto-flow: row;
    grid-template-rows: auto 1fr;
    grid-template-columns: auto auto 1fr auto;

    &[data-level="1"] {
      margin: 0;
    }

    &:not([data-level="1"]):first-child {
      margin-top: 8px;
    }

    // 2つ目以降のノードのborder-topを重ねさせる目的
    &:nth-child(n + 2) {
      margin-top: -1px;
    }

    &:not(.parent):not(.show_border) {
      border-color: transparent;
      background: transparent;
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
    top: -11973px;
    left: -21px;
    width: 30px;
    height: 12000px;
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
