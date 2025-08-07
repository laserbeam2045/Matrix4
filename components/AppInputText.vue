<template>
  <input
    ref="input"
    v-bind="props"
    :value="value"
    @input="onInput"
  >
</template>

<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-unused-vars */

const props = withDefaults(defineProps<{
  value: string | number
  type?: string
  list?: string
  required?: boolean
  readonly?: boolean
  spellcheck?: boolean
  placeholder?: string
  autocomplete?: string
}>(), {
  type: 'text',
  list: '',
  required: true,
  readonly: false,
  spellcheck: false,
  placeholder: '',
  autocomplete: 'off',
})

const emit = defineEmits<{
  'update:value': [value: string | number]
}>()

const input = ref(null)

const focus = () => input.value.focus()

const onInput = e => emit('update:value', e.target.value)
</script>

<style lang="scss" scoped>

input {
  width: auto;
  padding: 6px 12px;
  font: $normalFont;
  color: $blueLikeColor6;
  background: transparent;
  border: 1px solid $def-wrap-c2;
  transition: $neutral-transition;

  &::placeholder {
    color: $grayLikeColor2;
    transition: $neutral-transition;
  }
  &:focus {
    color: $act-input-c1;
    text-shadow: $text-shadow;
    background: $act-input-c2;
    border: 1px solid $act-wrap-c2;
    outline: none;
    box-shadow :
      $act-input-c4  2px  2px 20px,
      $act-input-c4 -2px -2px 20px,
      $act-input-c4 -2px  2px 20px inset,
      $act-input-c4  2px -2px 20px inset;
    transition : $focused-transition;

    &::placeholder {
      color: transparent;
      text-shadow: none;
      transition: all .5s;
    }
  }
  &:disabled {
    color: $grayLikeColor1;
  }
}
</style>
