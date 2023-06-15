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
  border-radius: 8px;
  // box-shadow: $windowBoxShadow;
  box-shadow: $box-shadow;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font: 15px/25px 'Roboto Mono', 'Inconsolata', monospace, sans-serif;
  border: 1px solid $color1;
  background: $color2;
  color: $color1;
  overflow: hidden;

    border-radius: 12px;
    backdrop-filter: blur(3px);
    background-color: rgba(34,198,213, 0.15);
    // box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
    border: 1px rgba(255,255,255,0.4) solid;

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
