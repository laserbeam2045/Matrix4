<script lang="ts" setup>
const { mouseTouchEvent } = useEvent()
const { AUDIOS, loadAudio, playAudio, stopAudio } = useAudio()

const { $router } = useNuxtApp()
const applicationMode = useState('applicationMode')

watch(applicationMode, (mode: number) => {
  setTimeout(() => {
    switch (mode) {
    case 1: $router.push('/main/conf'); break
    case 2: $router.push('/main/tree'); break
    case 3: $router.push('/main/quiz'); break
    case 4: $router.push('/main/cube'); break
    case 5: $router.push('/main/chart'); break
    case 6: $router.push('/main/prof'); break
    }
  }, 1800)
})

const eventName = computed(() => mouseTouchEvent.value.END + 'Passive')

const isSearchOn = useState('isSearchOn') as Ref<boolean>
const isSoundOn = useState('isSoundOn') as Ref<boolean>
const isSettingsOn = useState('isSettingsOn') as Ref<boolean>

const {
  $isOuterActive,
  $showNavigation,
  $toggleNavigation,
  $activateNavigation,
} = useNuxtApp()

const toggleNavigation = () => {
  if ($showNavigation.value) {
    playAudio(AUDIOS.ETC.CYBER_18_1)
  } else {
    playAudio(AUDIOS.ETC.CYBER_17_1)
  }
  $toggleNavigation()
}
const toggleSearch = async () => {
  if (isSearchOn.value && isSoundOn.value) {
    isSearchOn.value = false
    playAudio(AUDIOS.ETC.CYBER_18_1)
  } else {
    isSearchOn.value = true
    playAudio(AUDIOS.ETC.CYBER_17_1)
  }
}
const toggleSound = async () => {
  if (isSoundOn.value) {
    isSoundOn.value = false
  } else {
    isSoundOn.value = true
    await loadAudio(AUDIOS.ETC)
    playAudio(AUDIOS.ETC.CYBER_17_1)
  }
}
const toggleSettings = async () => {
  if (isSettingsOn.value && isSoundOn.value) {
    isSettingsOn.value = false
    playAudio(AUDIOS.ETC.CYBER_18_1)
  } else {
    isSettingsOn.value = true
    playAudio(AUDIOS.ETC.CYBER_17_1)
  }
}

onMounted(async () => {
  setTimeout(async () => {
    // if (!$showNavigation.value) return
    $isOuterActive.value = true
    setTimeout($activateNavigation, 10)
  }, 1500)
})
</script>

<template>
  <div class="container">
    <teleport to="#layer-4">
      <div class="buttons">
        <label>
          <input type="checkbox" :checked="$isOuterActive" @[eventName]="toggleNavigation" />
          <span></span>
          <i class="fa-solid fa-house"></i>
        </label>
        <label>
          <input type="checkbox" @[eventName]="toggleSearch" />
          <span></span>
          <i class="fa-solid fa-magnifying-glass"></i>
        </label>
        <label>
          <input type="checkbox" @[eventName]="toggleSound" />
          <span></span>
          <i :class="`fa-solid fa-volume-${isSoundOn ? 'high' : 'xmark'}`"></i>
        </label>
        <label>
          <input type="checkbox" @[eventName]="toggleSettings" />
          <span></span>
          <i class="fa-solid fa-gear"></i>
        </label>
      </div>
    </teleport>
  </div>
</template>

<style lang="scss" scoped>
.buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: flex;
  min-width: 100vw;
  max-width: 100vw;
  background: #e2f0fa;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  z-index: 200;
  padding: 20px 0 28px;
  border-top: 1px solid #0c67a1;

  $color0: rgb(0, 202, 202);
  $color1: #42cbf8;
  $color2: rgba(0, 10, 10, 0.5);
  $color3: rgba(0, 112, 202, 0.3);
  $color4: #0188ca;
  
  $box-shadow:
    $color3  2px  2px 10px,
    $color3 -2px -2px 10px,
    $color3  40px 0px 50px -50px inset,
    $color3 -40px 0px 50px -50px inset,
    $color4  0px -40px 50px -50px inset,
    $color4  0px  40px 50px -50px inset;

  box-shadow: $box-shadow;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font: 15px/25px 'Roboto Mono', 'Inconsolata', monospace, sans-serif;
  border-top: 1px solid $color1;
  background: $color2;
  color: $color1;
  overflow: hidden;

    backdrop-filter: blur(3px);
    background-color: rgba(34,198,213, 0.15);
    // box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
    border-top: 1px rgba(255,255,255,0.4) solid;

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  label {
    position: relative;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    > input {
      appearance: none;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      cursor: pointer;

      &:checked ~ span{
        box-shadow: inset 0 5px 1px 0 rgba(0, 0, 0, 0.1),
        0 5px 15px rgba(0,0,0,0.1),
        0 -5px 15px rgba(0,0,0,0.15);
        background: linear-gradient(#2b6b73, #31727a, #2b6b73);
      }

      &:checked ~ svg{
        top: 3px;
        color: #fff;
        filter: drop-shadow(0 0 5px #00ffe2) drop-shadow(0 0 8px #00ffe2) drop-shadow(0 0 12px #00ffe2) drop-shadow(0 0 16px #00ffe2);
      }
    }

    > span {
      position: absolute;
      width: 100%;
      height: 100%;
      background: linear-gradient(#fff, #ebf5fc, #ebf5fc);
      border-radius: 6px;
      box-shadow: inset 0 -5px 0 0 rgba(0,0,0,0.2),
      0 2px 10px rgba(0,0,0,0.75);
      pointer-events: none;
    }

    svg {
      position: relative;
      top: -3px;
      font-size: 1.5em;
      color: #8db4b5;
      pointer-events: none;
    }
  }
}
</style>
