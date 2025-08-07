<script setup lang="ts">
import { DRAG_MODE, DragMode } from '@/types/Draggable'
import { default as useTree, TreeOptions } from '@/composables/useTree'

import AppItem from '@/components/AppItem.vue'

defineEmits<{
  'touch': []
}>()

// const { mouseTouchEvent } = useEvent()

// const eventName = computed(() => mouseTouchEvent.value.START + 'Passive')

// const { setLoading } = useMatrix()

const dragMode = ref<DragMode>(DRAG_MODE.NODE)

const treeOptions: TreeOptions = reactive({ dragMode })

// 取得された木構造のデータと操作メソッド
const {
  treeData,
  treeMethods,
  // isTreeLoading,
} = useTree()

// watch(isTreeLoading, (isLoading) => {
//   setLoading(isLoading)
// })

const onTouchItem = () => 1

onMounted(() => {
  setTimeout(() => {
    treeMethods.changeRoot('11ZWlbuwWcP2+Bwi')
  }, 2100)
})
</script>

<template>
  <div>
    <div v-if="treeData" class="the-sample-tree">
      <!-- <AppWindowVirtual
        v-center="{ offset: 1.0 }"
        v-draggable
        legend="Filter"
        v-bind="$attrs"
        @[eventName]="$emit('touch')"
      > -->
      <div class="tree-container">
        <AppTreeBeta
          :display-mode="'beta'"
          :display-root="false"
          :tree-data="treeData"
          :tree-options="treeOptions"
          :item-component="AppItem"
          @touchItem="onTouchItem"
        />
      </div>
      <!-- </AppWindowVirtual> -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.the-sample-tree {
  display: flex;
  width: 333px;
  text-align: left;
  @include overflowScrolling;

  .tree-container {
    // width: 233px;
    // height: calc(100vh - 240px);
    height: 324px;
    margin: 0 0 8px;
    // margin: 0;
    flex-shrink: 0;
    backdrop-filter: blur(2px);
    background-color: rgba(0,61,125, 0.33);
    // @include overflowScrolling;
  }
}
</style>
