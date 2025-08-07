<template>
  <div
    class="app-input-text-two"
    :style="{ marginTop: placeholder ? '20px' : 0, minHeight: height, height }"
  >
    <textarea
      ref="inputRef"
      v-model="modelValue"
      v-quick-focus
      :type="type"
      :list="list"
      :required="required"
      :readonly="readonly"
      :spellcheck="spellcheck"
      :autocomplete="autocomplete"
      :style="{ paddingLeft: type === 'search' ? '24px' : '12px' }"
      v-bind="$attrs"
      @keydown.enter="onKeydown"
    />
    <span
      v-if="placeholder"
      class="placeholder"
      :class="{ dynamic, outside }"
    >
      <AppFontAwesome
        v-if="type === 'search'"
        icon-name="search"
        class="search"
      />
      {{ placeholder }}
    </span>
    <!-- <span class="line" /> -->
  </div>
</template>

<script lang="ts">
export default {
  // inheritAttrs: false,
}
</script>

<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useVModel } from '@vueuse/core'

const props = withDefaults(defineProps<{
  value: string | number
  type?: string
  list?: string
  required?: boolean
  readonly?: boolean
  spellcheck?: boolean
  placeholder?: string
  autocomplete?: string
  height?: string
  dynamic?: boolean
  outside?: boolean
}>(), {
  type: 'text',
  list: '',
  required: true,
  readonly: false,
  spellcheck: false,
  placeholder: '',
  autocomplete: 'off',
  height: '38px',
  dynamic: true,
  outside: true,
})

const emit = defineEmits<{
  'update:value': [e: Event]
  'keydown.enter': [e: Event]
}>()

const modelValue = useVModel(props, 'value', emit)

const inputRef = ref<HTMLInputElement | null>(null)

const focus = () => (inputRef.value as HTMLInputElement).focus()

const onKeydown = (e) => {
  emit('keydown.enter', e)
}
</script>

<style lang="scss" scoped>
.app-input-text-two {
  position: relative;
  width: 100%;
  min-width: 160px;
  transition: 0.5s;
  // color: #45f3ff;

  textarea {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 4px 12px;
    border: none;
    outline: none;
    box-shadow: none;
    font-size: 16px;
    font-family: $fontFamily9;
    // color: $blueLikeColor6;
    // color: $matrix4;
    // color: $textColor2;
    color: $textColor5;
    background: rgba(0,0,0,0.4);
    z-index: 1;
    border: 1px transparent solid;
    transition: $neutral-transition;

    &:not([readonly]):focus {
      text-shadow: $text-shadow;
      border: 1px solid $textColor2;
      color: $textColor2;
      background: rgba(0,0,0,0.5);
      outline: none;
      text-shadow: none;
      // box-shadow :
      //   $act-input-c4  2px  2px 20px,
      //   $act-input-c4 -2px -2px 20px,
      //   $act-input-c4 -2px  2px 20px inset,
      //   $act-input-c4  2px -2px 20px inset;
      transition : $focused-transition;
    }

    &:disabled {
      color: $grayLikeColor1;
    }
  }

  .placeholder {
    position: absolute;
    top: 0;
    left: 0;
    line-height: 40px;
    font-size: 15px;
    padding: 0 10px;
    display: block;
    transition: 0.5s ease-out;
    pointer-events: none;
    // color: $grayLikeColor3;
    color: #ccc;
    z-index: 1;
  }

  .placeholder.outside:not(.dynamic),
  textarea:focus + .placeholder.outside,
  textarea:valid + .placeholder.outside,
  textarea[readonly] + .placeholder.outside {
    position: absolute;
    top: -32px !important;
    left: -10px;
    color: #fff;
    @include textStyleC;
  }

  textarea + .placeholder {
    position: absolute;
    top: 0px !important;
    // @include textStyleC;
  }

  textarea:focus + .placeholder:not(.outside),
  textarea:valid + .placeholder:not(.outside) {
    opacity: 0;
  }

  .search {
    color: #ccc;
    line-height: 25px;
  }

  // .line {
  //   position: absolute;
  //   bottom: 0;
  //   display: block;
  //   width: 100%;
  //   height: 2px;
  //   background: #45f3ff;
  //   transition: 0.5s;
  //   border-radius: 2px;
  //   pointer-events: none;
  // }

  // textarea:focus ~ .line,
  // textarea:valid ~ .line {
  //   height: 100%;
  // }
}

textarea {
  -webkit-appearance: none; // 🚩これ無しだとスタイルがほぼ全く反映されないので注意
  appearance: none;
  outline: none; // スライダーのアウトラインは目障りになるので消す
  // background: #8acdff; // バーの背景色
  background: $greenLikeColor2; // バーの背景色
  width: 100%; // スライダーの幅
  height: 14px; // バーの高さ
  // border: solid 3px #dff1ff; // バーまわりの線
  border: solid 3px $textColor1; // バーまわりの線
  border-radius: 0px; // バーの端の丸み

  // -webkit-向けのつまみ
  &::-webkit-slider-thumb {
    -webkit-appearance: none; // 🚩デフォルトのつまみのスタイルを解除
    // background: #53aeff; // 背景色
    background: $textColor5;
    width: 24px; // 幅
    height: 24px; // 高さ
    // border: 1px solid $textColor1;
    border-radius: 50%; // 円形に
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.15); // 影
  }

  // -moz-向けのつまみ
  &::-moz-range-thumb {
    // background: #53aeff; // 背景色
    background: $textColor5;
    width: 24px; // 幅
    height: 24px; // 高さ
    // border: 1px solid $textColor1;
    border-radius: 50%; // 円形に
    box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.15); // 影
    border: none; // デフォルトの線を消す
  }

  // Firefoxで点線が周りに表示されてしまう問題の解消
  &::-moz-focus-outer {
    border: 0;
  }

  // つまみをドラッグしているときのスタイル
  &:active::-webkit-slider-thumb {
    box-shadow: 0px 5px 10px -2px rgba(0, 0, 0, 0.3);
  }
}
</style>
