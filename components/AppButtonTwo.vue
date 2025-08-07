<script lang="ts" setup>
import { useElementHover } from '@vueuse/core'

import useEvent from '@/composables/useEvent'

const emit = defineEmits<{
  end: [e: Event]
  start: [e: Event]
  clicked: [e: Event]
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
  min-width: 55px;
  min-height: 55px;
  cursor: pointer;
  padding: 8px 16px;
  // background: #333849;
  // border: 1px solid $act-wrap-c2;
  border: 1px solid;
  // line-height: 27px;
  font-size: 23px;
  font-weight: bold;
  font-family: $fontFamily9;
  box-sizing: border-box;
  // font-size: 1.6rem;
  font-weight: normal;
  letter-spacing: 0.01rem;
  text-shadow: none;
  box-shadow: none;
  color: #fff;
  transition: all .25s ease-out;
  white-space: nowrap;
  @include unSelectable;

    border-radius: 12px;
    backdrop-filter: blur(2px);
    // box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
    border: 1px rgba(255,255,255,0.4) solid;

  &.hover {
    // color: #2dfc52;
    filter:
      drop-shadow(0px 0px 2px #2dfc52)
      drop-shadow(0px 0px 4px #2dfc52)
      drop-shadow(0px 0px 8px #2dfc52);
    // border-color: $blueLikeColor6;
    // @include textStyleC;
    // @include boxStyleC;
  }
}
</style>
