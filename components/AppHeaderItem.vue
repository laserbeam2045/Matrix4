<template>
  <div
    class="header-item"
    :class="{ active: props.active }"
    v-on="events"
  >
    <span v-if="name === 'times'">x</span>
    <AppFontAwesome v-else :icon-name="name" />
  </div>
</template>

<script lang="ts" setup>
import useEvent from '@/composables/useEvent'

const props = withDefaults(defineProps<{
  name: string
  active?: boolean
}>(), {
  active: false,
})

const emit = defineEmits<{
  (event: 'click', e: Event): void
}>()

const { mouseTouchEvent } = useEvent()

const events = computed(() => ({
  [mouseTouchEvent.value.END]: (e: Event) => {
    e.stopPropagation()
    emit('click', e)
  },
}))
</script>

<style lang="scss" scoped>
.header-item {
  display: inline-block;
  width: $windowHeaderItemSize;
  height: $windowHeaderItemSize;
  font-size: $windowHeaderItemSize * 0.6;
  font-weight: normal;
  line-height: $windowHeaderItemSize;
  text-align: center;
  pointer-events: auto;
  transition: all .2s;
  color: $textColor1;
  font-size: 1.5rem;
  @if $test { background: yellow; }

  &:hover,
  &:focus {
    @include textStyleC;
    font-weight: normal;
    cursor: pointer;
  }
}
</style>
