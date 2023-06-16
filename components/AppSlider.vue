<script lang="ts" setup>
import { useScroll } from '@vueuse/core'

const props = defineProps<{
  tabs: string[]
  tabIndex: number
}>()

const emit = defineEmits<{
  (event: 'update:tabIndex', newValue: number): void
}>()

const {
  AUDIOS,
  playAudio,
  // stopAudio,
} = useAudio()

const count = computed(() => props.tabs.length)

const sliderStyle = computed(() => ({
  width: `${(100 / count.value)}%`,
  left: `${100 / count.value * props.tabIndex}%`,
}))

const size = reactive({
  maxWidth: 0,
  // offsetX: 0,
})

const sectionStyle = computed(() => ({
  width: `${size.maxWidth}px`,
  minWidth: '100%',
  // transform: `translateX(${size.offsetX}px)`,
  transform: `translateX(-${100 * props.tabIndex}%)`,
}))

const slots = useSlots()

const section = ref<HTMLElement | null>(null)

useScroll(section, {
  idle: 30,
  onStop: (e: Event) => {
    const { scrollLeft } = e.target as HTMLElement
    if (scrollLeft > (size.maxWidth * (props.tabIndex + 0.5))) {
      return emit('update:tabIndex', props.tabIndex + 1)
    }
    if (scrollLeft < (size.maxWidth * (props.tabIndex - 0.5))) {
      return emit('update:tabIndex', props.tabIndex - 1)
    }
    updateStyle()
  },
})

const updateStyle = () => {
  if (!document || slots.default === undefined || !section.value) return

  // size.maxWidth = size.offsetX = 0
  size.maxWidth = 0

  for (let i = 0; i < count.value; i++) {
    const child = section.value.children[i]
    if (size.maxWidth < child.scrollWidth) size.maxWidth = child.scrollWidth
    // if (i < props.tabIndex) size.offsetX -= child.scrollWidth
  }

  // section.value.scrollTo({
  //   behavior,
  //   left: -size.offsetX,
  // })
}

watch(() => props.tabIndex, () => {
  playAudio(AUDIOS.ETC.DECISION_46)
  updateStyle()
})

const mounted = ref(false)

onMounted(() => {
  updateStyle()
  setTimeout(() => {
    mounted.value = true
  }, 50)
})
</script>

<template>
  <div class="app-slider" :class="{ mounted }">
    <header class="header">
      <nav class="nav">
        <label
          v-for="(tab, index) in tabs"
          :key="tab"
          class="label"
          :class="{ checked: index === tabIndex }"
          @touchend.passive="emit('update:tabIndex', index)"
          @mouseup.passive="emit('update:tabIndex', index)"
        >
          {{ tab }}
        </label>
        <div class="slider" :style="sliderStyle" />
      </nav>
    </header>
    <section
      ref="section"
      :class="[blah.section, blah[`active-${tabIndex}`]]"
      :style="sectionStyle"
    >
      <slot />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.app-slider {
  overflow: visible;

  .header {
    font-size: 1rem;
    font-weight: 500;
    // font-family: $fontFamily5;
    letter-spacing: -7px;
    font-family: $fontFamily10;

    .nav {
      position: relative;
      height: 32px;
      width: 100%;
      display: flex;
      align-items: center;
      // color: $act-wrap-c2;
      color: #fff;
      @include unSelectable;
        // color: transparent;
        // -webkit-text-stroke: 1px #fff;

      .slider {
        position: absolute;
        height: 100%;
        border: 1px solid;
        border-radius: 4px;
        z-index: 0;
        transition: all 0.2s ease-out;
      }

      .label {
        display: block;
        height: 100%;
        width: 100%;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
        z-index: 1;
        font-weight: normal;
        transition: all 0.2s ease-out;

        &:hover {
          @include textStyleC;
        }

        &.checked:hover ~ .slider {
          @include boxStyleC;
        }

        &.checked {
          font-family: $fontFamily5;
          letter-spacing: 0;
        }
      }
    }
  }

  > section {
    opacity: 0;
    transition:
      opacity 0.2s 0s ease-out,
      transform 0s 0s ease-out;
  }

  &.mounted > section {
    opacity: 1;
    transition:
      opacity 0.2s 0.0s ease-out,
      transform 0.3s 0s ease-out;
  }
}
</style>

<style lang="scss" module="blah">
// @media screen and (max-width: 700px) {
//   .section {
//   }
// }

.section {
  display: flex;
  flex-wrap: nowrap;

  // overflow-x: scroll;
  // -webkit-overflow-scrolling: auto;
  // scroll-behavior: auto;

  // &::-webkit-scrollbar {
  //   display: none;
  // }

  > * {
    width: 100%;
    min-width: 100%;
    transition: all 0.1s ease-out;
    opacity: 0;
  }
}

@for $i from 0 through 9 {
  .active-#{$i} {
    > *:nth-child(#{$i + 1}) {
      opacity: 1;
    }
  }
}
</style>
