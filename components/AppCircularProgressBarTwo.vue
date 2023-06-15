<script setup lang="ts">
import gsap from 'gsap'

const props = defineProps<{
  percentage: number
  r: number
}>()

const data = reactive({
  tweenedNumber: 0,
})

const circleStyle = computed(() => ({
  width: (props.r * 2) + 'px',
  height: (props.r * 2) + 'px',
}))

const svgAttributes = computed(() => ({
  width: props.r * 2,
  height: props.r * 2,
  viewBox: `0 0 ${props.r * 2} ${props.r * 2}`,
}))

const getArcPath = ({ x, y, ir, or, angle }) => {
  const largeArcFlag = angle > 180 ? 1 : 0
  const rad = Math.PI * 2 * (angle / 360)

  const outside = {
    begin: {
      x: x,
      y: y - or,
    },
    end: {
      x: x + Math.sin(rad) * or - 0.001,
      y: y - Math.cos(rad) * or,
    },
  }

  const inside = {
    begin: {
      x: x + Math.sin(rad) * ir,
      y: y - Math.cos(rad) * ir,
    },
    end: {
      x: x + 0.001,
      y: y - ir,
    },
  }

  return `
    M${outside.begin.x},${outside.begin.y}
    A${or},${or} 0 ${largeArcFlag} 1 ${outside.end.x},${outside.end.y}
    L${inside.begin.x},${inside.begin.y}
    A${ir} ${ir} 0 ${largeArcFlag} 0 ${inside.end.x},${inside.end.y}
    L${outside.begin.x},${outside.begin.y}
  `
}

// ベースとなる円
const donutPath = computed(() => {
  const x = props.r
  const y = props.r
  const ir = props.r * (3 / 4)
  const or = props.r
  const angle = 360

  return getArcPath({ x, y, ir, or, angle })
})

// percentageに比例する円弧
const baumkuchenPath = computed(() => {
  const x = props.r
  const y = props.r
  const ir = props.r * (3 / 4)
  const or = props.r
  const angle = 360 * (data.tweenedNumber / 100)

  return getArcPath({ x, y, ir, or, angle })
})

const updateNumber = (newValue: number, oldValue: number) => {
  const duration = 0.015 * Math.abs(newValue - oldValue)

  gsap.to(data, {
    ease: 'ease-in-out',
    delay: 0.25,
    duration: Math.max(0.5, duration),
    tweenedNumber: newValue,
  })
}

watch(() => props.percentage, updateNumber)

onMounted(() => updateNumber(props.percentage, 0))
</script>

<template>
  <div class="app_circular_progress_bar" :style="circleStyle">
    <svg class="donut_svg" v-bind="svgAttributes">
      <path fill="rgba(0, 0, 0, 0.4)" :d="donutPath" />
    </svg>
    <svg class="baumkuchen_svg" v-bind="svgAttributes">
      <path fill="lightgreen" :d="baumkuchenPath" />
    </svg>
    <p class="percentage">{{ data.tweenedNumber.toFixed(0) }}％</p>
  </div>
</template>

<style lang="scss" scoped>
.app_circular_progress_bar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;

  .donut_svg {
    position: absolute;
  }

  .baumkuchen_svg {
    position: absolute;
    top: -100px;
    left: -100px;
    // clip-path: url("#donut");
    padding: 100px;
    overflow: visible;
    filter:
      drop-shadow(0px 0px 5px $matrix4)
      drop-shadow(0px 0px 15px $matrix4);
  }

  .percentage {
    position: absolute;
    margin: auto;
    font-family: $fontFamily9;
    color: #fff;
    text-shadow:
      0 0 5px $matrix4,
      0 0 15px $matrix4;
  }
}
</style>
