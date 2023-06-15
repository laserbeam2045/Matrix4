<script setup lang="ts">
const props = defineProps<{
  value: string | number
}>()

const emit = defineEmits<{
  (event: 'copy', payload: string)
}>()

const { copy } = useClipboard()

const { AUDIOS, playAudio } = useAudio()

// MEMO: isSupportedがfalseの場合のため
const copied = ref(false)

const { mouseTouchEvent } = useEvent()

const eventName = computed(() => `${mouseTouchEvent.value.END}Passive`)

const iconName = computed(() => copied.value ? 'check' : 'clone')

const intervalId = ref(null)

const execCopy = async () => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
  playAudio(AUDIOS.ETC.POP_1)
  await copy(String(props.value))
  await emit('copy', String(props.value))
  copied.value = true
  intervalId.value = setInterval(() => {
    copied.value = false
    intervalId.value = null
  }, 1500)
}
</script>

<template>
  <AppFontAwesome
    v-if="value"
    :key="iconName"
    class="icon"
    :class="{ active: copied }"
    :icon-name="iconName"
    @[eventName]="execCopy"
  />
</template>

<style lang="scss" scoped>
.icon {
  width: 18px;
  height: 21px;
  font-size: 25px;
  color: $textColor1;
}
</style>
