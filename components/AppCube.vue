<script setup lang="ts">
withDefaults(defineProps<{
  size?: number | string
  text1?: string
  text2?: string
  text3?: string
  text4?: string
  zIndex?: number | string
  animation?: boolean
  large?: boolean
}>(), {
  size: 100,
  text1: '',
  text2: '',
  text3: '',
  text4: '',
  zIndex: 1,
  animation: true,
  large: false,
})
</script>

<template>
  <div
    class="cube"
    :class="{ animation }"
    :style="`--size: ${size}px; --zIndex: ${zIndex};`"
  >
    <div>
      <div class="men" style="--i: 0;">
        <h2>{{ text1 }}</h2>
        <h2>{{ text1 }}</h2>
      </div>
      <div class="men" style="--i: 1;">
        <h2>{{ text2 }}</h2>
        <h2>{{ text2 }}</h2>
      </div>
      <div class="men" style="--i: 2;">
        <h2>{{ text3 }}</h2>
        <h2>{{ text3 }}</h2>
      </div>
      <div class="men" style="--i: 3;">
        <h2>{{ text4 }}</h2>
        <h2>{{ text4 }}</h2>
      </div>
      <div class="top" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$color1: #fff;
$color2: #777;
$color3: #aaa;
$color4: #444;

.cube {
  position: relative;
  width: var(--size);
  height: var(--size);
  transform-style: preserve-3d;
  // transform: rotateX(-30deg) rotateY(45deg);

  &.animation {
    animation: animate 4s linear infinite;
  }

  > div {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;

    > .men {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      // background: linear-gradient(#151515, #00ec00);
      transform: rotateY(calc(90deg * var(--i))) translateZ(calc(var(--size) / 2));
      transform-style: preserve-3d;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid $color4;

      &:nth-child(1) {
        background: $color3;
      }

      &:nth-child(2) {
        background: $color3;
      }

      &:nth-child(3) {
        background: $color3;
      }

      &:nth-child(4) {
        background: $color2;
      }

      > h2 {
        position: absolute;
        color: #fff;
        font-size: calc(var(--size) / 2);
        transform: translateZ(calc(var(--size) / 7));

        &:nth-child(1) {
          transform: translateZ(0) translateY(0px);
          color: rgba(0,0,0,0.2);
          filter: blur(2px);
        }
      }
    }

    > .top {
      position: absolute;
      top: 0;
      left: 0;
      width: var(--size);
      height: var(--size);
      background: $color1;
      border: 1px solid $color4;
      transform: rotateX(90deg) translateZ(calc(var(--size) / 2));

      // &::before {
      //   content: '';
      //   position: absolute;
      //   top: 0;
      //   left: 0;
      //   width: var(--size);
      //   height: var(--size);
      //   background: #0f0;
      //   transform: translateZ(calc((var(--size) + 0px) * -1));
      //   filter: blur(20px);
      //   box-shadow:
      //     0 0 120px rgba(0,255,0,0.2),
      //     0 0 200px rgba(0,255,0,0.4),
      //     0 0 300px rgba(0,255,0,0.6),
      //     0 0 400px rgba(0,255,0,0.8),
      //     0 0 500px rgba(0,255,0,1.0);
      // }
    }
  }
}

@keyframes animate
{
  0%
  {
    transform: rotateX(-30deg) rotateY(45deg);
  }
  100%
  {
    transform: rotateX(-30deg) rotateY(-315deg);
  }
}
</style>
