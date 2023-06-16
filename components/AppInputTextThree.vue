<template>
  <div class="input-text-root" :class="{ active, activate }">
    <div class="input-text-wrapper">
      <input
        v-model="modelValue"
        :type="type"
        :list="list"
        :required="required"
        :readonly="readonly"
        :spellcheck="spellcheck"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        @focus="active = true"
        @blur="active = false"
        @keydown.enter="onKeydown"
      >
      <!-- <div class="input-text-bar" /> -->
      <!-- <div class="input-text-bar" /> -->
    </div>
  </div>
</template>

<script lang="ts">
export default {
  // inheritAttrs: false,
}
</script>

<script lang="ts" setup>
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
  activate?: boolean
}>(), {
  type: 'text',
  list: '',
  required: false,
  readonly: false,
  spellcheck: false,
  placeholder: '',
  autocomplete: 'off',
  activate: false,
})

const emit = defineEmits<{
  (event: 'update:value', e: Event): void
  (event: 'keydown.enter', e: Event): void
}>()

const modelValue = useVModel(props, 'value', emit)

const active = ref(false)

const onKeydown = (e) => {
  emit('keydown.enter', e)
}
</script>

<style lang="scss" scoped>
$rootClass: input-text-root;
$wrapperClass: input-text-wrapper;
$barClass: input-text-bar;

$def-wrap-c1: rgb(44,68,76);
$def-wrap-c2: rgb(110,163,180);
$def-wrap-c3: linear-gradient(to right, $def-wrap-c1, $def-wrap-c1, $def-wrap-c1);
$def-wrap-c4: #626567b3;
$def-bar-c1 : rgb(72,113,131);
$def-bar-c2 : rgba(81,89,117,0.65);
$def-input-c: rgba(0,90,255,0.33);

$act-wrap-c1: rgb(14,74,86);
$act-wrap-c2: rgb(34,188,203);
$act-wrap-c3: linear-gradient(to right, $act-wrap-c1, $act-wrap-c2, $act-wrap-c1);
$act-wrap-c4: rgba(0,112,202,0.7);
$act-bar-c1 : rgb(64,204,225);
$act-bar-c2 : rgba(0,112,202,0.7);
$act-input-c1: rgb(1,195,237);
$act-input-c2: rgba(0,10,10,0.5);
$act-input-c3: rgba(0,90,255,0.33);
$act-input-c4: rgba(0,112,202,0.1);

$def-transition: all .5s;
$act-transition: all .3s;

// 共通のスタイル
div.#{$rootClass} {
  position: relative;

  div.#{$wrapperClass} {
    position: relative;
    padding: 0 7px;
    padding: 0;

    input {
      height: 40px;
      width: 100%;
      padding: 0 16px;
      // padding: 0;
      // margin: 0 16px;
      font: normal 15px/35px 'Orbitron', sans-serif;
      text-align: center;

      &::placeholder {
        transition: all .33s ease-out;
        color: rgba(140,140,140,1);
      }
    }
    input:focus {
      outline: none;

      &::placeholder {
        color: rgba(0,0,0,0);
        text-shadow: none;
      }
    }
    // div.#{$barClass} {
    //   position: absolute;
    //   top: 0;
    //   width: 15px;
    //   height: 43px;
    //   z-index: 3;
    // }
    // div.#{$barClass}:nth-of-type(1) { left: 0; }
    // div.#{$barClass}:nth-of-type(2) { right: 0; }
    // div.#{$barClass}::before,
    // div.#{$barClass}::after {
    //   position: absolute;
    //   width: 100%;
    //   height: 2px;
    //   display: block;
    // }
    // div.#{$barClass}::after { bottom: 0; }
  }
  div.#{$wrapperClass}::before,
  div.#{$wrapperClass}::after {
    content: '';
    position: relative;
    width: 100%;
    height: 1px;
    display: block;
  }
}

// 通常時のスタイル
div.#{$rootClass} {
  div.#{$wrapperClass}::before,
  div.#{$wrapperClass}::after {
    content: '';
    background: $def-wrap-c3;
    // box-shadow: $def-wrap-c4  2px  1px 2px,
    //             $def-wrap-c4 -2px  1px 2px,
    //             $def-wrap-c4  2px -1px 2px,
    //             $def-wrap-c4 -2px -1px 2px;
    transition: $def-transition;
  }
  // div.#{$barClass}::before,
  // div.#{$barClass}::after {
  //   content: '';
  //   opacity: 0;
  //   background: $def-bar-c1;
  //   box-shadow: $def-bar-c2  3px  1px 2px,
  //               $def-bar-c2 -3px  1px 2px,
  //               $def-bar-c2  3px -1px 2px,
  //               $def-bar-c2 -3px -1px 2px;
  //   transition: $def-transition;
  // }
  input {
    border: 1px solid transparent;
    color: silver;
    background: transparent;
    // text-shadow:
    //   $def-input-c  4px  4px 10px,
    //   $def-input-c -4px  4px 10px,
    //   $def-input-c  4px -4px 10px,
    //   $def-input-c -4px -4px 10px;
    transition: $def-transition;
  }
  // input::placeholder,
  // input::-webkit-input-placeholder,
  // input::-ms-input-placeholder,
  // input::-moz-placeholder,
  // input:-moz-placeholder {
  //   color: rgb(110, 143, 172);
  //   // text-shadow: 0 0 1px #2c3e50;
  //   transition: $def-transition;
  // }
}

// フォーカス時のスタイル
div.#{$rootClass}.active.activate {
  box-shadow:
    $act-input-c4  2px  2px 20px,
    $act-input-c4 -2px -2px 20px,
    $act-input-c4 -2px  2px 20px inset,
    $act-input-c4  2px -2px 20px inset;

  div.#{$wrapperClass}::before,
  div.#{$wrapperClass}::after {
    background: $act-wrap-c3;
    box-shadow: $act-wrap-c4  4px  4px 10px,
                $act-wrap-c4 -4px  4px 10px,
                $act-wrap-c4  4px -4px 10px,
                $act-wrap-c4 -4px -4px 10px;
    transition: $act-transition;
  }
  // div.#{$barClass}::before,
  // div.#{$barClass}::after {
  //   opacity: 1;
  //   background: $act-bar-c1;
  //   box-shadow:
  //     $act-bar-c2  7px  2px 10px,
  //     $act-bar-c2 -7px  2px 10px,
  //     $act-bar-c2  7px -2px 10px,
  //     $act-bar-c2 -7px -2px 10px;
  //   transition: $act-transition;
  // }
  input {
    color: $act-input-c1;
    background: $act-input-c2;
    // border-left: 1px solid rgb(44,68,76);
    // border-right: 1px solid rgb(44,68,76);
    text-shadow:
      $act-input-c3  4px  4px 10px,
      $act-input-c3 -4px  4px 10px,
      $act-input-c3  4px -4px 10px,
      $act-input-c3 -4px -4px 10px;
    transition: $act-transition;
  }
  // input:focus::placeholder,
  // input:focus::-webkit-input-placeholder,
  // input:focus::-ms-input-placeholder,
  // input:focus::-moz-placeholder,
  // input:focus:-moz-placeholder {
  //   color: transparent;
  //   text-shadow: none;
  //   transition: $act-transition;
  // }
}

// フォーカス時のスタイル
div.#{$rootClass}.active:not(.activate) {
  // box-shadow:
  //   $act-input-c4  2px  2px 20px,
  //   $act-input-c4 -2px -2px 20px,
  //   $act-input-c4 -2px  2px 20px inset,
  //   $act-input-c4  2px -2px 20px inset;

  // div.#{$wrapperClass}::before,
  // div.#{$wrapperClass}::after {
  //   background: $act-wrap-c3;
  //   box-shadow: $act-wrap-c4  4px  4px 10px,
  //               $act-wrap-c4 -4px  4px 10px,
  //               $act-wrap-c4  4px -4px 10px,
  //               $act-wrap-c4 -4px -4px 10px;
  //   transition: $act-transition;
  // }
  // div.#{$barClass}::before,
  // div.#{$barClass}::after {
  //   opacity: 1;
  //   background: $act-bar-c1;
  //   box-shadow:
  //     $act-bar-c2  7px  2px 10px,
  //     $act-bar-c2 -7px  2px 10px,
  //     $act-bar-c2  7px -2px 10px,
  //     $act-bar-c2 -7px -2px 10px;
  //   transition: $act-transition;
  // }
  input {
    color: #000;
    // background: $act-input-c2;
    // border-left: 1px solid rgb(44,68,76);
    // border-right: 1px solid rgb(44,68,76);
    // text-shadow:
    //   $act-input-c3  4px  4px 10px,
    //   $act-input-c3 -4px  4px 10px,
    //   $act-input-c3  4px -4px 10px,
    //   $act-input-c3 -4px -4px 10px;
    transition: $act-transition;
  }
  // input:focus::placeholder,
  // input:focus::-webkit-input-placeholder,
  // input:focus::-ms-input-placeholder,
  // input:focus::-moz-placeholder,
  // input:focus:-moz-placeholder {
  //   color: transparent !important;
  //   text-shadow: none;
  //   transition: $act-transition;
  // }
}
</style>
