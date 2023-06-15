<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: [
    'up',
    'down',
    'left',
    'right',
    'enter',
    'delete',
  ],
  setup() {
    const inputRef = ref(null)

    const focus = () => inputRef.value.focus()

    return {
      inputRef,
      focus,
    }
  },
})
</script>

<template>
  <input
    ref="inputRef"
    v-focus
    type="text"
    class="app-input-key"
    @keydown.ctrl.up="$emit('up', $event)"
    @keydown.ctrl.down="$emit('down', $event)"
    @keydown.ctrl.left="$emit('left', $event)"
    @keydown.ctrl.right="$emit('right', $event)"
    @keydown.ctrl.enter="$emit('enter', $event)"
    @keydown.ctrl.delete="$emit('delete', $event)"
  >
</template>

<style lang="scss" scoped>
.app-input-key {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  border: none;
}
</style>
