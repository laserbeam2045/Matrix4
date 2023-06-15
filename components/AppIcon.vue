<script setup lang="ts">
import { computed, toRefs } from 'vue'

const props = withDefaults(defineProps<{
  x?: number | string
  y?: number | string
  width?: number | string
  height?: number | string
  viewBox?: string
  color?: string
}>(), {
  x: 0,
  y: 0,
  width: 18,
  height: 18,
  viewBox: null,
  color: 'currentColor',
})

const { x, y, width, height, viewBox } = toRefs(props)

const viewBoxRef = computed(() => {
  return viewBox.value || `${x.value} ${y.value} ${width.value} ${height.value}`
})
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="icon-base"
    :width="width"
    :height="height"
    :viewBox="viewBoxRef"
    role="presentation"
  >
    <g :fill="color">
      <slot />
    </g>
  </svg>
</template>

<style scoped>
/* .icon-base {
  display: inline-block;
  vertical-align: baseline;
  margin-bottom: -2px;
} */
</style>
