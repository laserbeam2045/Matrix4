<template>
  <div
    class="toggle-button"
    :class="isOpen ? 'open' : 'close'"
  >
    ➣
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  isOpen: boolean
}>()
</script>

<style lang="scss" scoped>
.toggle-button {
  width: 30px;
  text-align: center;
  cursor: pointer;
  transition: all .4s;
  transform: rotate(90deg);

  &.close {
    color: white;
    text-shadow: rgb(0, 255, 255) 0 0 3px;
    transform: rotate(0deg);
  }
}
</style>
