<script setup lang="ts">
import gsap from 'gsap'

const props = defineProps<{
  value: string
}>()

const textOneRef = ref<HTMLElement | null>(null)
const textTwoRef = ref<HTMLElement | null>(null)

const textOne = ref('')
const textTwo = ref('')

const data = reactive({
  textOneActive: true,
  laserActive: false,
  laserX: 0,
  maxWidth: 0,
  maxHeight: 0,
  widthAppear: 0,
  widthDisappear: 0,
})

const timeoutId = ref(null)

const update = async (newValue) => {
  if (!props.value) return

  if (timeoutId.value) {
    clearTimeout(timeoutId.value)
    timeoutId.value = null
  }

  if (data.textOneActive) {
    textOne.value = newValue
  } else {
    textTwo.value = newValue
  }

  await new Promise((resolve) => setTimeout(resolve, 100))

  if (data.textOneActive) {
    data.widthAppear = textOneRef.value.offsetWidth
    data.widthDisappear = textTwoRef.value.offsetWidth
  } else {
    data.widthAppear = textTwoRef.value.offsetWidth
    data.widthDisappear = textOneRef.value.offsetWidth
  }

  data.laserX = 0
  data.maxWidth = Math.max(data.widthAppear, data.widthDisappear)
  data.maxHeight = Math.min(40, Math.max(textOneRef.value.offsetHeight, textTwoRef.value.offsetHeight))
  data.laserActive = true
  data.textOneActive = !data.textOneActive

  await gsap.to(data, {
    delay: 0.2,
    laserX: data.maxWidth,
    duration: Math.max(0.5, Math.min(1.5, 0.015 * data.maxWidth)),
  })

  data.laserActive = false

  timeoutId.value = setTimeout(() => {
    data.maxWidth = data.widthAppear

    if (data.textOneActive) {
      textOne.value = ''
    } else {
      textTwo.value = ''
    }
  }, 200)
}

const boxStyle = computed(() => ({
  width: data.maxWidth + 'px',
  height: data.maxHeight + 'px',
}))

const laserStyle = computed(() => ({
  left: (data.laserX - 2) + 'px',
  transform: `scaleY(${data.laserActive ? 1 : 0})`,
}))

const widthDifference = computed(() => (
  Math.abs(data.widthAppear - data.widthDisappear)
))

const svgAttributes = computed(() => ({
  width: data.maxWidth,
  height: data.maxHeight,
  viewbox: `0 0 ${data.maxWidth} ${data.maxHeight}`,
}))

const rectAppearAttributes = computed(() => ({
  x: '0',
  y: '0',
  width: data.widthAppear < data.widthDisappear ? Math.max(0, data.laserX - widthDifference.value / 2) : data.laserX,
  height: data.maxHeight,
}))

const rectDisappearAttributes = computed(() => ({
  y: '0',
  x: data.widthAppear < data.widthDisappear ? data.laserX : Math.max(0, data.laserX - widthDifference.value / 2),
  width: data.widthAppear < data.widthDisappear ? Math.max(0, data.maxWidth - data.laserX) : Math.max(0, data.maxWidth - data.laserX),
  height: data.maxHeight,
}))

watch(() => props.value, update)

onMounted(() => update(props.value))
</script>

<template>
  <div class="app_neon_text" :style="boxStyle">
    <p ref="textOneRef" class="text_one">{{ textOne }}</p>
    <p ref="textTwoRef" class="text_two">{{ textTwo }}</p>
    <div class="laser" :style="laserStyle" />
    <svg class="svg" v-bind="svgAttributes">
      <clipPath id="rect1">
        <rect v-bind="data.textOneActive ? rectDisappearAttributes : rectAppearAttributes" />
      </clipPath>
      <clipPath id="rect2">
        <rect v-bind="data.textOneActive ? rectAppearAttributes : rectDisappearAttributes" />
      </clipPath>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.app_neon_text {
  position: relative;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  transition: all .2s ease-out;
  min-height: 40px;

  .text_one,
  .text_two {
    position: absolute;
    padding: 0 24px;
    margin: 0;
    width: auto;
    height: 40px;
    line-height: 40px;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    white-space: nowrap;
    // letter-spacing: 0.1rem;
    font-family: $fontFamily5;
    text-shadow:
      +4px  4px 10px rgba(0,90,255,0.66),
      -4px -4px 10px rgba(0,90,255,0.66),
      -4px  4px 10px rgba(0,90,255,0.66),
      +4px -4px 10px rgba(0,90,255,0.66);
  }

  .text_one {
    top: 0;
    clip-path: url(#rect1);
  }

  .text_two {
    top: 0;
    clip-path: url(#rect2);
  }

  .laser {
    position: absolute;
    top: 0;
    width: 5px;
    height: 100%;
    border-radius: 10px;
    background: #fff;
    box-shadow:
      0 0 10px #00b3ff,
      0 0 20px #00b3ff,
      0 0 40px #00b3ff,
      0 0 80px #00b3ff,
      0 0 120px #00b3ff;
    transition: transform .2s ease;
    z-index: 10;
  }

  .svg {
    position: absolute;
    opacity: 0;
  }
}
</style>
