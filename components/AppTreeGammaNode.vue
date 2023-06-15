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
  (event: 'moveItem', payload: MoveProps): void
  (event: 'touchItem', treeData: TreeData): void
  (event: 'changeOpen', payload: TreeData): void
}>()

const {
  treeData,
  dragState,
  isDragging,
} = toRefs(props)

const treeState = useState('treeState') as Ref<TreeState>

const factions = computed(() => treeState.value.display.factions)

const sensor = computed(() => treeState.value.display.sensors)

const rootTag = computed(() => sensor.value === 'lifeforms' ? 'li' : 'fieldset')

const itemTag = computed(() => sensor.value === 'lifeforms' ? 'div' : 'div')

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

<template>
  <VueDraggableNext
    :tag="rootTag"
    class="app-tree-node"
    :class="{
      parent: isParent,
      single: treeData.children.length === 1,
      is_alpha: sensor === 'lifeforms',
      is_beta: sensor === 'economy',
      is_gamma: sensor === 'crime',
      show_line: (sensor === 'lifeforms' || sensor === 'crime') && factions[0] === true,
      show_border: (treeData.isGroup || isParent) && factions[1] === true,
      dragging: isSomeDragging,
      treeDragging: dragState.draggingID,
    }"
    :list="[itemProps]"
    :data-index="itemProps.index"
    :data-id="treeData.id"
    :title="treeData.txt"
    v-bind="dragNodeOptions"
    v-on="eventListeners.list"
  >
    <component
      :is="itemTag"
      class="item-container"
      :data-id="treeData.id"
    >
      <component
        :is="itemComponent"
        class="app-tree-item"
        :class="{ link: isLink, reflect: sensor === 'economy' && !(treeData.isGroup || isParent) }"
        :tree-data="treeData"
        v-on="eventListeners.item"
        @touchmove.prevent
      />
    </component>

    <div class="edge_container">
      <AppTreeGammaEdge
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
        // maxWidth: sensor === 'economy' && isParent ? `calc(max(750px, 89vw) - ${treeData.level * 40}px)` : 'auto',
        // maxWidth: sensor === 'economy' ? '94vw' : 'auto',
        }"
        @moveItem="$emit('moveItem', $event)"
        @touchItem="$emit('touchItem', $event)"
        @changeOpen="$emit('changeOpen', $event)"
      />
    </div>
  </VueDraggableNext>
</template>

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
  display: flex;
  flex-direction: row;

  // legend {
  //   position: absolute !important;
  //   top: 50%;
  //   left: 8px;
  //   transform: translateY(-50%);
  // }

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
  }

  // ガンマモード
  &.is_gamma {
    margin: 4px 0px 4px 0px;
    padding: 4px 8px 4px 8px;
    border-radius: 5px;

    &:not(.show_border) {
      border-color: transparent;
      background: transparent;
    }

    // &.parent {
    //   display: block;
    //   display: grid;
    //   grid-gap: 8px;
    //   grid-auto-flow: column;
    //   grid-template-rows: auto 1fr;
    //   grid-template-columns: auto auto 1fr auto;
    // }
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
    z-index: 2;
    align-items: center;
    text-align: left;
  }

  &.treeDragging > .item-container {
    z-index: 0;
  }

  // 子要素のラッパー
  .edge_container {
    position: relative;
    // display: flex;
    // align-items: center;
    // padding: 0 0 0;
    // margin: -0px 0 0 0;
    // grid-column: span 4;
    // min-height: 15px;
    min-width: 50px;
    flex-grow: 4;
    z-index: 1;
    @include unSelectable;
    // background: rgba(230, 20, 30, 0.1);
  }

  // 樹形図の線を表現するための簡易的な手法
  & > .item-container::before,
  & > .item-container::after {
    content: "";
    z-index: -1;
    color: #ddd;
    position: absolute;
    pointer-events: none;
    transition: opacity .1s;
  }

  // |＿
  & > .item-container::before {
    top: 50%;
    left: -29px;
    width: calc(30px);
    height: calc(50% + 11px);
    transform: translateY(calc(-100% + 1px));
    border-left: 2px solid;
    border-bottom: 2px solid;
  }

  // |￣
  & > .item-container::after {
    top: 50%;
    left: -29px;
    width: calc(30px);
    height: calc(50% + 11px);
    transform: translateY(calc(-1px));
    border-top: 2px solid;
    border-left: 2px solid;
  }

  &.parent {
    &.single {
      & > .item-container::before,
      & > .item-container::after {
        width: calc(100% + 88px);
      }
    }
    &:not(.single) {
      & > .item-container::before,
      & > .item-container::after {
        width: calc(100% + 60px);
      }
    }
  }

  &:first-child {
    & > .item-container::before {
      border: none;
    }
    & > .item-container::after {
      border-radius: 4px 0 0 0;
    }
    &:last-child {
      &.parent {
        &.single {
          & > .item-container::before {
            left: 0;
            width: calc(100% + 59px);
            border-bottom: 2px solid;
          }
        }
        &:not(.single) {
          & > .item-container::before {
            left: 0;
            width: calc(100% + 30px);
            border-bottom: 2px solid;
          }
        }
      }
    }
  }
  &:last-child {
    & > .item-container::before {
      border-radius: 0 0 0 4px;
    }
    & > .item-container::after {
      border: none;
    }
  }

  // &.treeDragging > .item-container::before,
  // &.treeDragging > .item-container::after,
  &:not(.show_line) > .item-container::before,
  &:not(.show_line) > .item-container::after {
    opacity: 0;
  }
}
</style>
