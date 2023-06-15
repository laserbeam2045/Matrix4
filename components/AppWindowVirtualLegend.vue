<script lang="ts" setup>
import useEvent from '@/composables/useEvent'

const props = defineProps<{
  legend: string | {
    text: string
    type: string
  }
}>()

const emit = defineEmits<{
  (event: 'touch')
}>()

const text = computed(() => {
  const { legend } = props
  return typeof(legend) === 'string' ? legend : legend.text
})

const type = computed(() => {
  const { legend } = props
  return typeof(legend) === 'string' ? 'inside' : legend.type
})

const { mouseTouchEvent } = useEvent()

const events = computed(() => ({
  [`${mouseTouchEvent.value.START}Passive`]() { emit('touch') },
}))
</script>

<template>
  <legend
    v-if="text"
    :class="type"
    v-on="events"
  >
    <div class="legend-div-1" />
    <div class="legend-div-2">
      <div />
    </div>
    <div class="legend-div-3" />
    <div class="legend-div-4">
      {{ text }}
    </div>
    <div
      class="legend-div-5 draggable-handle"
      @touchmove.self.prevent
    />
  </legend>
</template>

<style lang="scss" scoped>
$fontSize: 21px;
$borderRadius: 8px 8px 0 0;
$border: 1px solid $blueLikeColor6;

$legendBoxShadow: $inColorH $in-H-Offset 0 $inBlur $inSpread inset;   // 内側左

legend {
  @include unSelectable;
  @include textStyleA;

  height: 0;
  font-family: $fontFamily4;
  font-size  : $fontSize;
  line-height: $fontSize;

  // 内側に配置する場合のスタイル
  &.inside {
    $paddingTop: 0;
    $paddingLnR: 16px;
    $paddingBottom: 0;

    position: absolute;
    top: 0;
    left: 0;

    // テキスト用
    .legend-div-4 {
      padding: $paddingTop $paddingLnR $paddingBottom;
      line-height: $windowHeaderItemSize;
    }
    // ドラッグハンドル用
    .legend-div-5 {
      @include absoluteBox;

      height: $windowHeaderItemSize;
    }
  }

  // 外側に配置する場合のスタイル
  &.outside {
    $paddingTop: 12px;
    $paddingLnR: 17px;
    $paddingBottom: 12px;

    position: absolute;
    // top: -(floor($fontSize / 2) + $paddingTop - 1);
    top: -($fontSize + $paddingTop + $paddingBottom + 1);
    left: -1px;

    // 背景色用
    .legend-div-1 {
      @include absoluteBox;

      right: -1px;
      // height: $fontSize;
      height: $fontSize + $paddingTop + $paddingBottom + 1;
      border-radius: $borderRadius;
    }
    // box-shadow用
    .legend-div-2 {
      @include absoluteBox;
      // height: $fontSize + 1;
      height: $fontSize + $paddingTop + $paddingBottom;
      overflow: hidden;
      border-radius: $borderRadius;
      & > div {
        @include absoluteBox;

        right: -500px;
        box-shadow: $legendBoxShadow;
      }
    }
    // ボーダー用
    .legend-div-3 {
      @include absoluteBox;

      right: -1px;
      // height: $fontSize;
      height: $fontSize + $paddingTop + $paddingBottom;
      border: $border;
      border-bottom: none;
      border-radius: $borderRadius;
    }
    // テキスト用
    .legend-div-4 {
      position: relative;
      height: $fontSize;
      padding: $paddingTop $paddingLnR $paddingBottom;
    }
    // ドラッグハンドル用
    .legend-div-5 {
      @include absoluteBox;

      height: ($fontSize + $paddingTop + $paddingBottom + 6);
    }
  }
}

.main.dark {
  legend.outside {
    & > div:nth-of-type(1) {
      background: $windowDarkBackground;
    }
    // & > div:nth-of-type(3) {
    //   border-bottom: 1px solid $windowDarkBackground;
    // }
  }
}
.main.light {
  legend.outside {
    & > div:nth-of-type(1) {
      background: $windowLightBackground;
    }
    // & > div:nth-of-type(3) {
    //   border-bottom: 1px solid $windowLightBackground;
    // }
  }
}
.main.classic {
  legend.outside {
    & > div:nth-of-type(1) {
      background: $windowLightBackground;
    }
    // & > div:nth-of-type(3) {
    //   border-bottom: 1px solid $windowLightBackground;
    // }
  }
}
</style>
