<script lang="ts">
export default {
  layout: 'the-matrix',
}
</script>

<script setup lang="ts">
const mounted = ref(false)

const isVisible = ref(false)

const state = reactive({
  text1: '',
  text2: '',
  text3: '',
  checked: false,
})

const tabIndex = ref(0)

const breakpoints = useBreakpoints({
  tablet: 640,
  laptop: 1024,
  desktop: 1280,
})

const phone = breakpoints.smaller('tablet')
const tablet = breakpoints.between('tablet', 'laptop')
const laptop = breakpoints.between('laptop', 'desktop')
const desktop = breakpoints.greater('desktop')

const windowWidth = computed(() => {
  if (phone.value) return '365px'
  if (tablet.value) return '630px'
  if (laptop.value) return '630px' // '1014px'
  if (desktop.value) return '630px' //'1270px'
})

const {
  AUDIOS,
  playAudio,
  // stopAudio,
} = useAudio()

onMounted(() => {
  setTimeout(() => {
    mounted.value = true
    isVisible.value = true
  }, 100)
})
</script>

<template>
  <div v-if="mounted" class="the_ui_samples">
    <AppWindowModal
      v-center
      legend="UI"
      :is-visible="isVisible"
      @close="isVisible = false"
    >
      <div :style="{ width: windowWidth, minWidth: windowWidth }">
        <AppSlider
          v-model:tabIndex="tabIndex"
          :tabs="['Interface', 'Audios']"
          class="p-4"
        >
          <div class="flex justify-center pt-16">
            <div class="flex flex-col flex-wrap content-center gap-8" style="width: 320px;">
              <AppButton>AppButton</AppButton>
              <AppButtonTwo>AppButtonTwo</AppButtonTwo>
              <AppInputCheckbox v-model:checked="state.checked" />
              <AppInputText v-model:value="state.text1" placeholder="AppInputText" />
              <AppInputTextTwo v-model:value="state.text2" placeholder="AppInputTextTwo" />
              <AppInputTextThree v-model:value="state.text3" placeholder="AppInputTextThree" />
            </div>
          </div>
          <div class="pt-4 flex flex-row flex-wrap content-start justify-between">
            <AppButton
              v-for="label in AUDIOS.ETC"
              :key="label"
              class="mt-2"
              @click="playAudio(label)"
            >
              {{ label }}
            </AppButton>
          </div>
        </AppSlider>
      </div>
    </AppWindowModal>
  </div>
</template>

<style lang="scss" scoped>
.the_ui_samples {
  width: 100vw;
  height: 100vh;
  background-image: linear-gradient(rgb(0, 210, 255) 0%, rgb(24, 80, 153) 32%, rgb(4, 20, 82) 74%);
}
</style>
