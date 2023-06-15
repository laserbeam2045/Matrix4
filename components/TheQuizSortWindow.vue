<script setup lang="ts">
import { VueDraggableNext } from 'vue-draggable-next'

import type { SortItem } from '@/composables/useQuiz'

const props = defineProps<{
  sortConditions: SortItem[]
}>()

defineEmits<{
  (event: 'touch'): void
}>()

const { mouseTouchEvent } = useEvent()

const eventName = computed(() => mouseTouchEvent.value.START + 'Passive')

const computedSortConditions = computed(() => (
  props.sortConditions.map((item) => ({
    ...item,
    isActive: item.order !== 'NONE',
    orderLabel: item.order === 'ASC' ? '↑' : item.order === 'DESC' ? '↓' : '',
  }))
))

const onClickSortItem = ({ label }) => {
  const item = props.sortConditions.find(item => item.label === label)

  item.order =
    item.order === 'ASC'
      ? 'DESC'
      : 'ASC'
}
</script>

<template>
  <div @[eventName]="$emit('touch')">
    <fieldset class="sort mt-0">
      <VueDraggableNext
        class="sort_list"
        :list="sortConditions"
        tag="ul"
      >
        <li
          v-for="item in computedSortConditions"
          :key="item.label"
          class="sort_item"
          :class="{ active: item.isActive }"
          @click="onClickSortItem(item)"
        >
          {{ item.label }}
          <span class="order">{{ item.orderLabel }}</span>
        </li>
      </VueDraggableNext>
    </fieldset>
  </div>
</template>

<style lang="scss" scoped>

.sort {
  width: 365px;
  padding: 64px 16px 16px;
  display: flex;
  justify-content: center;
  // border: 1px solid transparent;
  // background: rgba(0, 0, 0, 0.4);
  // border-radius: 5px;

  .legend {
    padding: 0px 16px;
    margin-left: 16px;
    color: #fff;
    text-align: left;
  }

  .sort_list {
    display: flex;
    flex-direction: column;
    width: 200px;

    .sort_item {
      display: inline-block;
      position: relative;
      padding: 7px 32px 7px 9px;
      font-size: 14px;
      // color: #42cbf8;
      // color: $textColor4;
      white-space: nowrap;
      background: #001c26;
      border: 1px solid;
      border-radius: 5px;
      font-family: $fontFamily9;
      cursor: pointer;
      @include unSelectable;

      &:not(:first-child) {
        margin-top: 8px;
      }

      &.active {
        color: orange;
      }
      &:not(.active) {
        color: gray;
      }

      .order {
        position: absolute;
        right: 8px;
      }
    }
  }
}
</style>
