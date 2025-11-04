<script setup lang="ts">
const props = defineProps<{
  value: string | number
}>()

const emit = defineEmits<{
  copy: [payload: string]
}>()

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

  try {
    const textToCopy = String(props.value)

    // モダンなClipboard APIを試す
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy)
    } else {
      // フォールバック: レガシーな方法でコピー（画面の乱れを防ぐ）
      const textArea = document.createElement('textarea')
      textArea.value = textToCopy
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      textArea.style.opacity = '0'
      textArea.setAttribute('readonly', '')
      textArea.style.pointerEvents = 'none'
      document.body.appendChild(textArea)

      // スクロールを保存
      const scrollX = window.scrollX
      const scrollY = window.scrollY

      textArea.focus({ preventScroll: true })
      textArea.select()

      try {
        document.execCommand('copy')
      } finally {
        document.body.removeChild(textArea)
        // スクロール位置を復元
        window.scrollTo(scrollX, scrollY)
      }
    }

    await emit('copy', textToCopy)
    copied.value = true
    intervalId.value = setInterval(() => {
      copied.value = false
      intervalId.value = null
    }, 1500)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
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
