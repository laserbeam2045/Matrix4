<script setup lang="ts">
import gsap from 'gsap'

const props = withDefaults(defineProps<{
  value: number
  ease?: string
  delay?: number
  duration?: number
}>(), {
  delay: 0,
  ease: 'ease-in-out',
  duration: 0.5,
})

const data = reactive({
  tweenedNumber: 0,
})

const animatedNumber = computed(() => {
  return Number(data.tweenedNumber.toFixed(0)).toLocaleString()
})

watch(() => props.value, (newValue, oldValue) => {
  const proportionalDuration = Math.min(3, 0.0015 * Math.abs(newValue - oldValue))
  gsap.to(data, {
    ease: props.ease,
    delay: props.delay,
    duration: Math.max(props.duration, proportionalDuration),
    tweenedNumber: newValue,
  })
})
</script>

<template>
  <span>{{ animatedNumber }}</span>
</template>
