<script setup lang="ts">
defineProps<{
  checked: boolean
}>()

const emit = defineEmits<{
  'update:checked': [payload: boolean]
}>()

const { AUDIOS, playAudio } = useAudio()

const activate = () => {
  emit('update:checked', true)
  playAudio(AUDIOS.ETC.CYBER_15_3)
}

const deactivate = () => {
  emit('update:checked', false)
  playAudio(AUDIOS.ETC.CYBER_15_4)
}
</script>

<template>
  <label class="app_input_checkbox">
    <input
      type="checkbox"
      :checked="checked"
      @change="($event.target as HTMLInputElement).checked ? activate() : deactivate()"
    >
    <span>
      <i />
    </span>
  </label>
</template>

<style lang="scss" scoped>
.app_input_checkbox {
  display: inline-block;
  position: relative;
  width: 48px;
  height: 24px;
  cursor: pointer;

  input {
    position: relative;
    z-index: 1;
    appearance: none;
    display: none;
  }

  input:checked ~ span {
    background: #05be05;
    box-shadow: 0 0px 4px #05be66;

    i {
      left: 26px;

      &::before {
        background: #05be05;
        box-shadow: 7px 0 0 #05be05;
      }

      &::after {
        bottom: 3px;
        height: 5px;
        border-radius: 0;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        background: #05be05;
      }
    }
  }

  span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fe0000;
    border-radius: 24px;
    box-shadow: 0 0px 4px #fe0066;
    transition: all 0.5s ease-out;

    i {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: #fff;
      border-radius: 50%;
      transition: all 0.5s ease-out;

      &::before {
        content: '';
        position: absolute;
        top: 6px;
        left: 5px;
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: #fe0000;
        box-shadow: 7px 0 0 #fe0000;
        transition: all 0.5s ease-out;
      }

      &::after {
        content: '';
        position: absolute;
        bottom: 5px;
        left: calc(50% - 5px);
        width: 10px;
        height: 2px;
        border-radius: 3px;
        background: #fe0000;
        transition: all 0.5s ease-out;
      }
    }
  }
}
</style>
