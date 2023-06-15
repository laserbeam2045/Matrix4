<script setup lang="ts">
const props = defineProps<{
  percentage: number
  split: number
  r: number
  blockWidth: number
}>()

const circleStyle = computed(() => ({
  width: props.r + 'px',
  height: props.r + 'px',
}))

const blockStyle = computed(() => ({
  width: props.blockWidth + 'px',
  height: Math.round(props.r / 7) + 'px',
  transformOrigin: `0 ${Math.round(props.r / 2)}px`,
  // filter: `hue-rotate(${360 * (props.percentage / 100)}deg)`,
}))

const textStyle = computed(() => ({
  fontSize: Math.round(props.r * 0.2 + 2) + 'px',
  // filter: `hue-rotate(${360 * (props.percentage / 100)}deg)`,
  filter: 'hue-rotate(90deg)',
}))

const number = ref(0)

watch(() => props.percentage, () => {
  nextTick(() => {
    setTimeout(() => {
      number.value = props.percentage
    }, 950)
  })
})

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      number.value = props.percentage
    }, 950)
  })
})
</script>

<template>
  <div
    class="circle"
    :style="[`--split: ${split}`, circleStyle]"
  >
    <div
      v-for="i of split"
      :key="i"
      class="blocks"
      :class="{ light: (i === 1 && i === percentage) || i <= Math.floor((percentage / 100) * split) }"
      :style="[
        `
          animation-delay: ${(1 / split) * i}s;
          transform: rotate(${(360 / split) * i}deg);
        `,
        blockStyle
      ]"
    />
    <h3
      class="text"
      :class="{ light: percentage }"
      :style="textStyle"
    >
      <AppTweenNumber
        :value="number"
        :duration="0.01 * props.percentage"
      />％
    </h3>
  </div>
</template>

<style lang="scss" scoped>
$lightColor: #0f0;
// $darkColor: #050c09;
$darkColor: rgb(31, 78, 102);

.circle {
  position: relative;

  .blocks {
    position: absolute;
    left: 50%;
    // border-radius: 8px;
    background: $darkColor;

    &.light {
      animation: animate 1.9s forwards ease-in-out;
    }
  }

  .text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-family: $fontFamily9;
    color: $lightColor;

    &.light {
      text-shadow:
        0 0 5px $lightColor,
        0 0 15px $lightColor;
    }
  }
}

@keyframes animate {
  0%, 50%
  {
    background: $darkColor;
    box-shadow: none;
  }
  50.1%, 99.9%
  {
    background: $lightColor;
    box-shadow:
      0 0 5px $lightColor,
      0 0 15px $lightColor,
      0 0 30px $lightColor;
  }
  100%
  {
    background: $lightColor;
    box-shadow:
      0 0 5px $lightColor,
      0 0 15px $lightColor,
      0 0 30px $lightColor;
    filter: hue-rotate(90deg);
  }
}
</style>
