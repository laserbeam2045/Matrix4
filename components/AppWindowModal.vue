<script lang="ts" setup>
const props = withDefaults(defineProps<{
  isVisible: boolean
  level?: number
  legend?: string
  offset?: number
  resizable?: 'all' | 'vertical' | 'horizontal' | 'diagonal'
}>(), {
  level: 4,
  legend: '',
  offset: 1.0,
  resizable: null,
})

const emit = defineEmits<{
  'update:isVisible': [value: boolean]
  'close': []
}>()

const open = () => {
  emit('update:isVisible', true)
}

const close = () => {
  emit('update:isVisible', false)
}

const toggle = () => {
  emit('update:isVisible', !props.isVisible)
}

const on = { open, close, toggle }
</script>

<template>
  <div style="display: none;">
    <teleport :to="`#layer-${level}`">
      <transition name="fade">
        <div
          v-if="isVisible"
          class="modal-window"
          v-bind="$attrs"
          @touchmove.self.stop.prevent
          @wheel.self.stop.prevent
        >
          <AppWindowVirtual
            v-center="{ offset }"
            v-draggable
            v-resizable:[resizable]
            class="window"
            :legend="legend"
          >
            <template #buttons>
              <AppHeaderItem
                name="times"
                @touchend="close(); $emit('close')"
                @mouseup="close(); $emit('close')"
              />
            </template>
            <template #default>
              <slot :on="on" />
            </template>
          </AppWindowVirtual>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style lang="scss" scoped>
.modal-window {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // background: rgb(0, 0, 0);
  // background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  background-color: rgba(0,61,125, 0.33);
  transition: all 0.33s ease-out;

  // background-color: rgba(255, 255, 255, 0.1); /* 背景色 */
  // -webkit-backdrop-filter: blur(3px); /* ぼかしエフェクト */
  // backdrop-filter: blur(3px);
  // box-shadow: 0 5px 20px rgba(255, 152, 79, 0.5); /* 薄い影 */
}

// .fade-enter-active,
// .fade-leave-active {
//   transition: all 0.5s ease-out;
// }

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-from {
  transform: scale(1.2);
}

// .fade-enter-from .window {
//   transform: translateY(100px);
// }

// .fade-enter-to .window {
//   transform: translateX(-100px);
// }
</style>
