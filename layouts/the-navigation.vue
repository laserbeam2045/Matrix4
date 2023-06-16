<script lang="ts" setup>
import { Ref } from 'vue'

import useEvent from '@/composables/useEvent'
// import { useAudio, AUDIOS } from '@/composable/useAudio'

export type CircularItem = {
  itemId: number
  prefix?: string
  iconName: string
}

// const props = defineProps<{
//   selectedItem: number | null
// }>()

const emit = defineEmits<{
  (event: 'selectItem', itemId: number): void
}>()

const applicationMode = useState('applicationMode')

const circularItems = [
  {
    itemId: 1,
    iconName: 'cogs',
  },
  {
    itemId: 2,
    iconName: 'project-diagram',
  },
  {
    itemId: 3,
    prefix: 'fab',
    iconName: 'quora',
  },
  // {
  //   itemId: 4,
  //   prefix: 'fas',
  //   iconName: 'dice-d20',
  // },
  {
    itemId: 4,
    prefix: 'fab',
    iconName: 'codepen',
  },
  // {
  //   itemId: 6,
  //   iconName: 'paint-brush',
  // },
  // {
  //   itemId: 7,
  //   iconName: 'object-group',
  // },
  {
    itemId: 5,
    iconName: 'chart-bar',
  },
  {
    itemId: 6,
    iconName: 'address-card',
  },
]

const isOuterActive = ref(false)
const showNavigation = useState('showNavigation')
const isCircleActive = useState('isCircleActive')

const { mouseTouchEvent } = useEvent()

const eventName = computed(() => `${mouseTouchEvent.value.START}Passive`)

const selectedId = ref(applicationMode.value ?? 0) as Ref<number>

const additionalNumber = ref(0)

// const { playAudio } = useAudio()

// const getY = (x: number) => {
//   x = x % 6
//   return x <= 0 ? -2 - x : 4 - x
// }

const getZ = (x: number) => {
  x = x % 6
  if (x <= -3) return x + 6
  if (4 <= x) return x - 6
  return x
}

const selectItem = (item: CircularItem) => {
  // if (selectedId.value !== item.itemId) {
  // playAudio(AUDIOS.ETC.DECISION_25)
  selectedId.value = item.itemId
  emit('selectItem', item.itemId)
  applicationMode.value = item.itemId
  // rotate()
  // setTimeout($deactivateNavigation, 800)
  // }
}

// const rotate = () => {
//   additionalNumber.value += getY(additionalNumber.value + selectedId.value)
// }

const reset = () => {
  additionalNumber.value = getZ(additionalNumber.value)
}

const {
  $activateNavigation,
  $deactivateNavigation,
  $toggleNavigation,
} = useNuxtApp()

watch(showNavigation, (flg) => {
  if (!flg) {
    reset()
  }
})

// const { loadAudio } = useAudio()

// const loadFlag = ref(false)

// const loadAudios = () => {
//   if (!loadFlag.value) {
//     // loadAudio(AUDIOS.ETC)
//     loadFlag.value = true
//   }
// }

// const src = require('')

// const audioPlayed = ref(false)

const { AUDIOS, playAudio } = useAudio()

const foo = async (item: CircularItem) => {
  // if (!audioPlayed.value) {
  //   audioPlayed.value = true
  //   playAudio(AUDIOS.ETC.ETC_BOOT)
  //   setInterval(() => {
  //     playAudio(AUDIOS.ETC.ETC_BOOT)
  //   }, 7000)
  // }
  playAudio(AUDIOS.ETC.DECISION_43)
  selectItem(item)
}

onMounted(async () => {
  setTimeout(async () => {
    isOuterActive.value = true
    setTimeout($activateNavigation, 100)
  }, 3500)
})
</script>

<template>
  <div style="display: none;">
    <teleport to="#layer-3">
      <transition :appear="true">
        <div v-if="isOuterActive">
          <transition :appear="true">
            <div
              v-if="showNavigation"
              class="modal-window"
              v-bind="$attrs"
              @touchmove.prevent
              @wheel.stop.prevent
              >
              <!-- @click.self="$toggleNavigation" -->
              <div
                v-center="{ offset: 1.5 }"
                class="menu"
                :class="{ active: isCircleActive }"
              >
                <AppHexagon
                  class="toggle"
                  @[eventName]="$toggleNavigation"
                >
                  <!-- <AppFontAwesome
                    prefix="fab"
                    icon-name="phoenix-framework"
                  /> -->
                  <div class="phoenix">
                    <AppSquidGame
                      icon="phoenix"
                      :width="45"
                      :height="45"
                    />
                  </div>
                <!-- <div class="phoenix" /> -->
                <!-- <AppIcon
                  width="11.6000000pt"
                  height="12.8000000pt"
                  viewBox="0 0 1160.000000 1280.000000"
                >
                  <IconGood />
                </AppIcon> -->
                </AppHexagon>
                <li
                  v-for="item in circularItems"
                  :key="item.iconName"
                  :class="{ active: item.itemId === selectedId }"
                  :style="`
                --i:${item.itemId + 1 + additionalNumber};
                --j:${(item.itemId + additionalNumber) % 6 + 1}
              `"
                >
                  <AppHexagon @[eventName]="foo(item)">
                    <AppSquidGame
                      v-if="item.iconName === 'project-diagram'"
                      icon="tree"
                      :width="30"
                      :height="30"
                      view-box="0 0 16 16"
                    />
                    <AppSquidGame
                      v-else-if="item.iconName === 'quora'"
                      icon="q"
                      :width="48"
                      :height="48"
                      view-box="0 0 48 48"
                      style="position: relative; top: -9px;"
                    />
                    <AppSquidGame
                      v-else-if="item.iconName === 'codepen'"
                      icon="code"
                      :width="42"
                      :height="42"
                      view-box="0 0 32 32"
                      style="position: relative; top: -6px;"
                    />
                    <AppSquidGame
                      v-else-if="item.iconName === 'chart-bar'"
                      icon="book"
                      :width="48"
                      :height="48"
                      view-box="0 0 24 24"
                      style="position: relative; top: -11px;"
                    />
                    <AppSquidGame
                      v-else-if="item.iconName === 'cogs' || item.iconName === 'address-card'"
                      icon="null"
                      :width="32"
                      :height="32"
                      view-box="0 0 24 24"
                      style="position: relative; top: -1px;"
                    />
                    <AppFontAwesome
                      v-else
                      :prefix="item?.prefix ?? ''"
                      :icon-name="item.iconName"
                    />
                  </AppHexagon>
                </li>
              </div>
            </div>
          </transition>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.modal-window {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(2px);
  background-color: rgba(0,61,125, 0.33);
  transition: all 0.5s ease;
}

.menu {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  .toggle {
    // position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    // font-size: 2.7rem !important;
    z-index: 3;
    transition: all 1.25s ease-out;
    // transform: rotate(-360deg);
    opacity: 0;

    .phoenix {
      position: relative;
      top: -6px;
    }

    // .foo {
    //   // src: url("@/assets/images/2099119.svg") no-repeat;
    //     width: 174px;
    //     width: 110px;
    //     height: 92px;
    //     height: 107px;
    //     position: relative;
    //     top: -33px;
    //     // width: 100%;
    //     // height: 100%;
    //     background: url("@/assets/images/ark-logo-horizontal.svg") no-repeat;
    //     // background: url("@/assets/images/Matrix-logo.svg") no-repeat;
    //     // background: url("@/assets/images/ClipartKey_1068795.png") no-repeat;
    //     // box-shadow: 3px 0 white 10px 10px;
    //     background-size: 100% 100%;
    //     background-position: 36px center;
    //     // border: 1px solid white;
    // }
  }

  li {
    position: absolute;
    left: 0;
    list-style: none;
    font-size: 3rem;
    transition: 0.5s;
    transition-delay: calc(0.075s * var(--j));
    transform: rotate(0deg) translateX(41px) scale(0.333);
    transform-origin: 150px;
    opacity: 0;

    &.active {

      > * {
        // transform: rotate(calc(360deg / -6 * var(--j))) translateY(16px) scale(1.5);
        transition: .25s ease-out;
        animation: animate 2s linear infinite;

        @keyframes animate
        {
          0%
          {
            filter: hue-rotate(0deg);
          }
          100%
          {
            filter: hue-rotate(360deg);
          }
        }
      }
    }

    > * {
      display: flex;
      align-items: center;
      justify-content: center;
      transform: rotate(calc(360deg / -6 * var(--j)));
      transition: 0.2s ease-out;
    }
  }

  &.active {
    .toggle {
      // transform: rotate(-360deg);
      opacity: 1;
    }

    li {
      opacity: 1;
      transition-delay: 0s;
      transform: rotate(calc(360deg / 6 * var(--i))) scale(1);
    }
  }
}

.activator {
  position: fixed !important;
  // left: calc(min(8%, 25px));
  // left: 25px;
  right: 25px;
  // bottom: calc(min(6%, 48px));
  // bottom: 48px;
  top: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 3rem;
  z-index: 3;
  transition: all 1.25s ease-out;
}

.v-enter-active,
.v-leave-active {
  transition: all .75s ease-out !important;
}

.v-leave-to,
.v-enter-from {
  opacity: 0;
}

.v-enter-to,
.v-leave-from {
  opacity: 1;
}
</style>
