<script lang="ts" setup>
import { Ref } from 'vue'

const { matrix, setInfo } = useMatrix()
const { mouseTouchEvent } = useEvent()

const { AUDIOS, loadAudio, playAudio, stopAudio } = useAudio()

const eventName = computed(() => mouseTouchEvent.value.END + 'Passive')

// const count = ref(0)
// const increment = () => count.value++

const { $toggleNavigation } = useNuxtApp()

const isSoundOn = useState('isSoundOn') as Ref<boolean>
const showNavigation = useState('showNavigation') as Ref<boolean>

const toggleSound = async () => {
  if (isSoundOn.value) {
    isSoundOn.value = false
    stopAudio(AUDIOS.ETC.AlanWalker)
  } else {
    isSoundOn.value = true
    await loadAudio(AUDIOS.QUIZ)
    await loadAudio(AUDIOS.ETC)
    playAudio(AUDIOS.ETC.CYBER_17_1)
    playAudio(AUDIOS.ETC.AlanWalker)
  }
}

const toggleNavigation = () => {
  if (showNavigation.value) {
    playAudio(AUDIOS.ETC.CYBER_18_1)
  } else {
    playAudio(AUDIOS.ETC.CYBER_17_1)
  }

  $toggleNavigation()
}

const displayInfo = ref('')
const matrixInfo = computed(() => matrix.value.info.text)
const matrixTime = computed(() => matrix.value.info.time)

watch(matrixTime, () => {
  if (matrixInfo.value) {
    const temp = displayInfo.value = matrixInfo.value
    setTimeout(() => displayInfo.value = '', 50)
    setTimeout(() => {
      if (matrixInfo.value === temp) {
        setInfo('')
      }
    }, 5000)
  }
})
</script>

<template>
  <div>
    <teleport to="#layer-5">
      <div id="header">
        <div class="app_info_container">
          <transition name="app-info" appear>
            <div v-if="matrixInfo" id="app-info">
              <div id="app_info_inner">
                <h1 class="px-0 py-0" :class="{ warning: false }">
                  <AppNeonText :value="displayInfo" />
                </h1>
              </div>
            </div>
          </transition>
        </div>
        <div class="left_container">
          <ul class="indicator">
            <li
              :class="{ active: isSoundOn }"
              style="padding-top: 16px;"
              @[eventName]="toggleSound"
            >
              <AppSquidGame
                :icon="isSoundOn ? 'volume' : 'mute'"
                :width="isSoundOn ? 16 : 17"
                :height="isSoundOn ? 16 : 17"
                view-box="0 0 32 32"
                :active="isSoundOn"
              />
            </li>
          </ul>
        </div>
        <div class="right_container">
          <ul class="settings">
            <li
              :class="{ active: showNavigation }"
              @[eventName]="toggleNavigation"
            >
              <AppSquidGame
                icon="phoenix"
                :width="22"
                :height="22"
                view-box="0 0 512 512"
                :active="showNavigation"
              />
            </li>
          </ul>
        </div>
      </div>
    </teleport>
  </div>
</template>

<style lang="scss" scoped>
*::before,
*::after {
  transition: all .5s ease-out;
}

// @media screen and (max-width: 500px) {
//   .left_container,
//   .right_container {
//     &,
//     &::before,
//     &::after {
//       padding-top: 32px;
//       // background: #000;
//     }
//   }
//   .app_info_container::before,
//   .app_info_container::after {
//     z-index: 3 !important;
//   }
// }

#header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: auto;
  display: flex;
  flex-wrap: wrap;
  user-select: none;
  font-family: $fontFamily4;
  z-index: 6;

  *::before,
  *::after {
    content: '';
    z-index: 1;
  }

  .left_container,
  .app_info_container::before,
  .app_info_container::after,
  .right_container {
    background-color: rgba(0,0,0,0.9);
    border-bottom: 1px solid #0c67a1;
    transition: all 0.5s ease-out;
    z-index: 1;
  }

  .left_container > ul > li,
  .right_container > ul > li {
    position: relative;
    display: inline-block;
    height: 40px;
    padding-top: 20px;
    text-align: center;
    color: #248bcf;
    font-size: 11px;
    cursor: pointer;
    font-family: $fontFamily1;
    z-index: 2;
  }

  .left_container > ul > li::before,
  .left_container > ul > li::after,
  .right_container > ul > li::before,
  .right_container > ul > li::after {
    position: absolute;
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    content: '';
  }

  .left_container > ul > li::after,
  .right_container > ul > li::before {
    z-index: -1;
    height: 3px;
    opacity: 1;
    background-color: #15669b;
    transition: opacity 150ms ease-out,
                background-color 150ms ease-out;
  }

  .left_container > ul > li.active::after,
  .right_container > ul > li.active::before {
    background-color: #42edf8;
    opacity: 1;
    box-shadow: 4px  4px 10px rgba(0,112,202,0.7),
                -4px -4px 10px rgba(0,112,202,0.7),
                -4px  4px 10px rgba(0,112,202,0.7),
                4px -4px 10px rgba(0,112,202,0.7);
  }

  .left_container > ul::after,
  .right_container > ul::before {
    z-index: 4;
    width: 6px;
    height: 30px;
    background-color: #0c67a1;
  }

  .left_container::before,
  .right_container::after {
    position: absolute;
    top: auto;
    left: 0;
    right: 0;
    bottom: 3px;
    border-bottom: 1px solid #0c67a1;
  }

  .left_container::after,
  .right_container::before {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 40px 40px 0;
    border-color: transparent rgba(0,0,0,0.9) transparent transparent;
  }

  .left_container {
    position: absolute;
    left: 0;
    padding-left: 25px;

    ul {
      li {
        width: 69px;
        height: 33px;
        padding-top: 14px;
        padding-left: 38px;
        padding-right: 10px;
      }
      li.active {
        // cursor: default;
        color: #42edf8;
        color: #fff;
      }
      li:not(.active)::after {
        opacity: 0;
      }
      li::before,
      li::after {
        bottom: -7px;
        transform: skewX(-45deg);
        transform-origin: bottom right;
      }
      li::before {
        border-left: 2px solid #0c67a1;
        height: 15px;
      }
    }
    ul::after {
      position: absolute;
      top: auto;
      left: auto;
      right: -1px;
      bottom: 0;
      transform: skewX(-45deg);
      transform-origin: bottom right;
    }
  }
  .left_container::after {
    position: absolute;
    top: auto;
    left: auto;
    right: -40px;
    bottom: 0;
    transform: scaleX(-1);
  }

  .app_info_container {
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-box-align: start;
    -ms-flex-align: start;
    align-items: flex-start;
    color: #42edf8;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    // box-shadow: 4px 4px 10px rgb(0 112 202 / 70%), -4px -4px 10px rgb(0 112 202 / 70%), -4px 4px 10px rgb(0 112 202 / 70%), 4px -4px 10px rgb(0 112 202 / 70%);

    // > div {
    //   transform: scaleX(0) scaleY(0) translateY(0);
    // }

    #app-info {
      transition: all .3s ease-out;
      pointer-events: auto;
      display: block;
      height: 10px;
      padding: 10px 30px 0;
      position: relative;
      background-color: rgba(0,0,0,0.9);
      font-family: 'Orbitron',sans-serif;
      font-size: 14px;
      // text-transform: uppercase;
      text-align: center;
      z-index: 3;

      #app_info_inner {
        display: flex;
        align-items: flex-end;
        height: 40px;
        margin-top: -10px;
        padding: 0;
        letter-spacing: 1px;
        background-color: rgba(0,0,0,0.9);
        border-bottom: 2px solid;

        h1 {
          color: #14e6fa;
          text-shadow:rgba(0,90,255,0.66)  4px  4px 10px,
                      rgba(0,90,255,0.66) -4px  4px 10px,
                      rgba(0,90,255,0.66)  4px -4px 10px,
                      rgba(0,90,255,0.66) -4px -4px 10px;
          margin: 0;
          font-size: inherit;
          font-weight: inherit;
          cursor: default;
        }
        h1.warning {
          color: #fee5a1;
          text-shadow: rgba(255,54,0,0.35)  4px  4px 10px,
                       rgba(255,54,0,0.35) -4px -4px 10px,
                       rgba(255,54,0,0.35) -4px  4px 10px,
                       rgba(255,54,0,0.35)  4px -4px 10px;
          opacity: .8;
        }
      }
      #app_info_inner::before,
      #app_info_inner::after {
        position: absolute;
        top: auto;
        bottom: -30px;
        z-index: 4;
        width: 6px;
        height: 30px;
        background-color: #42edf8;
        box-shadow: 4px  4px 10px rgba(0,112,202,0.7),
                   -4px -4px 10px rgba(0,112,202,0.7),
                   -4px  4px 10px rgba(0,112,202,0.7),
                    4px -4px 10px rgba(0,112,202,0.7);
      }
      #app_info_inner::before {
        left: -1px;
        right: auto;
        transform: skew(45deg);
        transform-origin: top right;
      }
      #app_info_inner::after {
        left: auto;
        right: -1px;
        transform: skew(-45deg);
        transform-origin: top left;
      }
    }
    #app-info::before {
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 30px 30px 0;
      border-color: transparent rgba(0,0,0,0.9) transparent transparent;
      position: absolute;
      top: auto;
      left: 0;
      bottom: -30px;
      right: auto;
    }
    #app-info::after {
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 30px 30px 0;
      border-color: transparent rgba(0,0,0,0.9) transparent transparent;
      position: absolute;
      top: auto;
      left: auto;
      bottom: -30px;
      right: 0;
      -webkit-transform: scaleX(-1);
      transform: scaleX(-1);
    }
  }
  .app_info_container::before,
  .app_info_container::after {
    padding-top: 10px;
    display: block;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    z-index: 1;
    pointer-events: auto;
  }

  .right_container {
    position: absolute;
    right: 0;
    padding-right: 25px;
    // z-index: 10;

    ul {
      li {
        width: 69px;
        height: 33px;
        padding-top: 14px;
        padding-left: 12px;
        font-size: 12px;
        text-align: left;
      }
      li.active {
        // cursor: default;
        color: #42edf8;
        color: #fff;
      }
      li:not(.active)::before {
        opacity: 0;
      }
      li::before,
      li::after {
        bottom: -7px;
        transform: skewX(45deg);
        transform-origin: bottom left;
      }
      li::after {
        border-right: 2px solid #0c67a1;
        height: 15px;
      }
    }
    ul::before {
      position: absolute;
      top: auto;
      left: -1px;
      right: auto;
      bottom: 0;
      // z-index: 3;
      transform: skewX(45deg);
      transform-origin: bottom left;
    }
  }
  .right_container::before {
    position: absolute;
    top: auto;
    left: -40px;
    right: auto;
    bottom: 0;
  }
}

    .app-info-enter-active {
      transition: all .5s ease-out;
    }
    .app-info-leave-active {
      transition: all .5s ease-out;
    }
    .app-info-enter-from {
      opacity: 0;
      transform: scaleX(0) scaleY(0) translateY(-10px);
    }
    .app-info-leave-to {
      transform: scaleX(0) scaleY(0) translateY(19px);
    }
</style>
