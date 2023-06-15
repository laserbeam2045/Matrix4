<template>
  <div class="app-hexagon" :style="styleContainer">
    <div class="hexagonA" :style="styleA" />
    <div class="hexagonB" :style="styleB" />
    <span class="body" :style="styleSpan">
      <slot />
    </span>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{
  width?: number
}>(), {
  width: 55,
})

const RATIO = 0.5806451612903226
const BORDER_WIDTH = 2

const widthA = computed(() => props.width + BORDER_WIDTH * 2)
const heightA = computed(() => widthA.value * RATIO)

const widthB = computed(() => props.width)
const heightB = computed(() => widthB.value * RATIO)

const styleContainer = computed(() => ({
  width: `${props.width}px`,
  height: `${heightA.value}px`,
}))

const styleA = computed(() => ({
  top: `-${BORDER_WIDTH}px`,
  left: `-${BORDER_WIDTH}px`,
  width: `${widthA.value}px`,
  height: `${heightA.value}px`,
}))

const styleB = computed(() => ({
  top: `-${1}px`,
  left: `-${0}px`,
  width: `${widthB.value}px`,
  height: `${heightB.value}px`,
}))

const styleSpan = computed(() => ({
  height: `${heightA.value}px`,
  lineHeight: `${heightA.value}px`,
}))
</script>

<style lang="scss" scoped>
$borderColor: rgba( 255, 255, 255, 1 );
// $borderColor: #42edf8;

$backgroundColorA: $borderColor;
$backgroundColorB: #3188fa;
// $backgroundColorB: #42CBF8;
// $backgroundColorB: #42edf8;

// * {
//   box-sizing: border-box;
// }

.app-hexagon {
	margin: 0 auto;
	position: relative;
  // color: #fff;
  color: #FFFFFF;
  // color: #42edf8;
  // color: #3188fa;
  font-size: 2.0rem !important;
  cursor: pointer;

  .hexagonA,
  .hexagonB {
    position: absolute;
    transition: all 0.2s linear;
    opacity: 0.634;
    opacity: 1;
    cursor: pointer;

    &:before,
    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transition: all 0.2s linear;
      z-index: 0;
      cursor: pointer;
    }
    &:before {
      transform: rotate(60deg);
    }
    &:after {
      transform: rotate(-60deg);
    }
  }

  .hexagonA {
    opacity: 0.666;
    background: $backgroundColorA;
    backdrop-filter: blur( 6.5px );
    -webkit-backdrop-filter: blur( 6.5px );

    &:before,
    &:after {
      background: $backgroundColorA;
    }
  }

  .hexagonB {
    background: $backgroundColorB;
    box-shadow: 0 16px 32px 0 rgba(187, 183, 250, 1);

    &:before,
    &:after {
      background: $backgroundColorB;
    }
  }

  span.body {
    display: flex;
    justify-content: center;
    position: absolute;
    z-index: 1;
  }
}
</style>
