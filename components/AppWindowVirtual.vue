<script lang="ts" setup>
withDefaults(defineProps<{
  width?: string
  height?: string
  legend?: string | {
    text: string
    type: string
  }
}>(), {
  width: 'auto',
  height: 'auto',
  legend: 'TEST',
})

// const { AUDIOS, playAudio } = useAudio()

// onMounted(() => {
//   playAudio(AUDIOS.ETC.DECISION_33)
// })

// onUnmounted(() => {
//   playAudio(AUDIOS.ETC.CYBER_04_1)
// })
</script>

<template>
  <div
    class="virtual-window"
    :style="{ width, height }"
    v-bind="$attrs"
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 300 600"
      preserveAspectRatio="none"
    >
      <path d="M0,10 L15,0 L105,0 L120,10 L180,10 L195,0 L 285,0 L300,10 L300,70 L290,85 L290,145 L300,160 L300,410 L290,425 L290,485 L300,500 L300,590 L285,600 L15,600 L0,590 L0,500 L10,485 L10,425 L0,410 L0,160 L10,145 L10,85 L0,70 z" vector-effect="non-scaling-stroke" />
    </svg>
    <div class="buttons">
      <slot name="buttons" />
    </div>
    <div
      class="header draggable-handle"
      @touchmove.self.prevent
    >
      <slot name="header" />
    </div>
    <div class="body">
      <slot />
    </div>
    <div class="footer">
      <slot name="footer" />
    </div>
    <AppWindowVirtualLegend :legend="legend" />
  </div>
</template>

<style lang="scss" scoped>
// $windowBoxShadow:
//   $outColor   $out-H-Offset    $out-V-Offset  $outBlur $outSpread,        // 外側右下
//   $outColor (-$out-H-Offset)   $out-V-Offset  $outBlur $outSpread,        // 外側左下
//   $outColor (-$out-H-Offset) (-$out-V-Offset) $outBlur $outSpread,        // 外側左上
//   $outColor   $out-H-Offset  (-$out-V-Offset) $outBlur $outSpread,        // 外側右上
//   $inColorH    $in-H-Offset                0   $inBlur  $inSpread inset,  // 内側左
//   $inColorH  (-$in-H-Offset)               0   $inBlur  $inSpread inset,  // 内側右
//   $inColorV               0   (-$in-V-Offset)  $inBlur  $inSpread inset,  // 内側下
//   $inColorV               0     $in-V-Offset   $inBlur  $inSpread inset;  // 内側上

// matrix-code.herokuapp.com
$color0: rgb(0, 202, 202);
$color1: #42cbf8;
$color2: rgba(0, 10, 10, 0.5);
$color3: rgba(0, 112, 202, 0.3);
$color4: #0188ca;

$box-shadow:
  $color3  2px  2px 10px,
  $color3 -2px -2px 10px,
  $color3  40px 0px 50px -50px inset,
  $color3 -40px 0px 50px -50px inset,
  $color4  0px -40px 50px -50px inset,
  $color4  0px  40px 50px -50px inset;

// fieldset {
//   position: relative;
//   width: 100%;
//   height: 100%;
//   margin: 0;
//   padding: 0;
//   color: $color1;
//   background: $color2;
//   border: 1px solid $color1;
//   border-radius: 8px;
//   font: 15px/25px 'Roboto Mono', 'Inconsolata', monospace, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   box-shadow: $color3  2px  2px 10px,
//               $color3 -2px -2px 10px,
//               $color3  40px 0px 50px -50px inset,
//               $color3 -40px 0px 50px -50px inset,
//               $color4  0px -40px 50px -50px inset,
//               $color4  0px  40px 50px -50px inset;
//   overflow: hidden;
// }
// matrix-code.herokuapp.com

// 外枠のスタイル
.virtual-window {
  display: flex;
  flex-direction: column;
  width: auto;
  height: auto;
  max-width: 100vw;
  max-height: 100vh;
  text-align: center;
  // border: 1px solid $blueLikeColor6;
  //border-radius: 8px;
  // box-shadow: $windowBoxShadow;
  //box-shadow: $box-shadow;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font: 15px/25px 'Roboto Mono', 'Inconsolata', monospace, sans-serif;
  //border: 1px solid $color1;
  //background: $color2;
  color: $color1;
  overflow: hidden;

    //border-radius: 12px;
    //backdrop-filter: blur(7px);
    //background-color: rgba(34,198,213, 0.15);
    // box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
    //border: 1px rgba(255,255,255,0.4) solid;

    $color-svg: rgba(255,255,255,0.4);
    //$color-svg: rgba(30,206,116,0.9);

    > svg {
      z-index: -1;
      position: absolute;
      display: block;

      path {
        stroke: darken($color-svg, 10%);
        fill: rgba(34,198,213, 0.20);
        stroke-width: 2px;
      }
    }

    //clip-path: path("M 0,10 L 15,0 L 110,0 L 125,10 L 185,10 L200,0 L 295,0 L310,10 L310,30 L300,45 L300,75 L310,90 L 310,352 L 0,352 z");

  .buttons {
    position: absolute;
    top: 0;
    right: 0;
    pointer-events: none;
  }
  .header {
    width: 100%;
    height: auto;
    padding-top: $windowHeaderItemSize;
    @if $test { background: $greenLikeColor1; }
  }
  .body {
    width: 100%;
    min-width: 0;
    height: auto;
    min-height: 0;
    // overflow: hidden;
  }
  .footer {
    width: 100%;
    height: auto;
    @if $test { background: $greenLikeColor1; }
  }
}

// .main.dark {
//   .virtual-window {
//     color: $windowDarkTextColor;
//     background: $windowDarkBackground;
//   }
// }
// .main.light {
//   .virtual-window {
//     color: $windowLightTextColor;
//     background: $windowLightBackground;
//   }
// }
// .main.classic {
//   .virtual-window {
//     color: $windowLightTextColor;
//     background: $windowLightBackground;
//   }
// }
</style>
