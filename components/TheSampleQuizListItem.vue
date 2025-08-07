<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

defineProps<{
  question: string
  pressPoint: number
}>()

const emit = defineEmits<{
  in: []
  out: []
}>()

const target = ref<HTMLElement | null>(null)
const visible = ref(false)

useIntersectionObserver(
  target,
  ([{ isIntersecting }]) => {
    visible.value = isIntersecting
    if (isIntersecting) emit('in')
    else emit('out')
  },
)
</script>

<template>
  <p
    ref="target"
    class="question"
    :class="{ visible }"
  >
    <span
      v-for="(c, i) in question"
      :key="i"
      :style="{ color: i < pressPoint ? 'white' : 'inherit' }"
    >
      {{ c }}
    </span>
  </p>
</template>

<style lang="scss" scoped>
.question {
  display: block;
  margin: 0;
  padding: 0 0 0 16px;
  max-width: 305px;
  text-align: left;
  white-space: wrap;
  font-family: $fontFamily9;
  transition: opacity 0.3s 0s ease-out;
  opacity: 1;

  &.visible {
    opacity: 1;
  }

  // &:not(.failed) {
  //   border: 1px solid red;
  // }
}
</style>
