<script setup lang="ts">
import type { TreeOptions } from '@/composables/useTree'
import { DRAG_MODE, DragMode } from '@/types/Draggable'
import AppItem from '@/components/AppItem.vue'

defineProps<{
  isVisible: boolean
}>()

defineEmits<{
  (event: 'close'): void
}>()

const dragMode = ref<DragMode>(DRAG_MODE.LOCK)

const treeOptions: TreeOptions = reactive({ dragMode })

// 取得された木構造のデータと操作メソッド
const {
  // rootId,
  treeData,
  treeMethods,
  // treeHistory,
  // isTreeLoading,
  // isTreeOldData,
} = useTree()

const onMoveItem = () => { 1 }

const onTouchItem = () => { 1 }

const onChangeOpen = () => { 1 }

const mounted = ref(false)

onMounted(() => {
  setTimeout(async () => {
    await treeMethods.changeRoot('11ZWlbuwWcP2+Bwi')
    await treeMethods.updateData()

    console.log(treeData.value)

    mounted.value = true
  }, 0)
})
</script>

<template>
  <AppWindowModal
    v-center
    v-draggable
    legend="Quiz Tags"
    :level="5"
    :is-visible="mounted && isVisible"
    @close="$emit('close')"
  >
    <div class="the_quiz_tags_window">
      <AppTreeBeta
        :display-root="false"
        :tree-data="treeData"
        :tree-options="treeOptions"
        :item-component="AppItem"
        @moveItem="onMoveItem"
        @touchItem="onTouchItem"
        @changeOpen="onChangeOpen"
      />
    </div>
  </AppWindowModal>
</template>

<style lang="scss" scoped>
.the_quiz_tags_window {
  width: calc(100vw - 16px);
  height: calc(100vh - 106px);
  padding: 0 16px 16px;
  bottom: 0;
  @include overflowScrolling;
}
</style>
