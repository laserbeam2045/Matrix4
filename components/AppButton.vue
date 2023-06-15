<script lang="ts" setup>
import { useElementHover } from '@vueuse/core'

import useEvent from '@/composables/useEvent'

const emit = defineEmits<{
  (event: 'end', e: Event): void
  (event: 'start', e: Event): void
  (event: 'clicked', e: Event): void
}>()

const myHoverElement = ref(null)
const isHovered = useElementHover(myHoverElement)

const { mouseTouchEvent } = useEvent()

const { isSupportTouch } = useEvent()

const events = computed(() => ({
  [`${mouseTouchEvent.value.START}`]: (e: Event) => {
    e.stopPropagation()
    emit('start', e)
  },
  [`${mouseTouchEvent.value.END}`]: (e: Event) => {
    e.stopPropagation()
    emit('end', e)
  },
  [`${mouseTouchEvent.value.CLICK}`]: (e: Event) => {
    e.stopPropagation()
    emit('clicked', e)
  },
}))
</script>

<template>
  <button
    ref="myHoverElement"
    class="app-button"
    :class="{ hover: !isSupportTouch && isHovered }"
    v-on="events"
  >
    <slot>Submit</slot>
  </button>
</template>

<style lang="scss" scoped>
.app-button {
  padding: 6px 10px;
  font-family: $fontFamily5;
  color: $grayLikeColor3;
  color: $act-wrap-c2;
  cursor: pointer;
  background: transparent;
  // border: 1px solid $act-wrap-c2;
  border: 1px solid;
  border-radius: 5px;
  transition: all .75;
  font-size: 14px;
  font-family: $fontFamily3;
  box-sizing: border-box;
  // font-size: 1.6rem;
  font-weight: normal;
  letter-spacing: 0.01rem;
  text-shadow: none;
  box-shadow: none;
  // color: $textColor1;
  color: #fff;
  transition: all .2s;
  @include unSelectable;

  &.hover {
    // color: $blueLikeColor6;
    // border-color: $blueLikeColor6;
    @include textStyleC;
    @include boxStyleC;
  }
}
</style>
