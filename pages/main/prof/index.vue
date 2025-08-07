<script lang="ts">
export default {
  layout: 'the-matrix',
}
</script>

<script setup lang="ts">
const key = ref(null)
const focus = () => key.value.focus()

const mounted = ref(false)

onMounted(() => {
  const { setInfo } = useMatrix()

  // setInfo('How many cubes?')

  setTimeout(() => {
    mounted.value = true
  }, 1000)
})
</script>

<template>
  <div class="avalon pt-16 pb-8 px-8" :class="{ mounted }">
    <div class="box px-4 pt-2 pb-1 mb-6">
      <div class="box_container">
        <p style="position: absolute; top: 50px; left: 30px; background: black; color: white; z-index: 1000;">
          <a href="https://have-a-go.moo.jp/avalon/aaa.mp4" target=”_blank” style="color: rgb(23, 210, 207);">
            パズルの探索プログラム。使用例はこちらをクリックしてください。
          </a>
          <br>
          SEARCHボタンを押すことで、パズルの解を探索します。
        </p>
        <iframe
          id="inlineFrameExample"
          title="Inline Frame Example"
          width="100%"
          height="100%"
          src="http://minecraft-344519.uc.r.appspot.com/">
        </iframe>
      </div>
      <NuxtLayout name="the-header" />
      <NuxtLayout name="the-loading" />
      <NuxtLayout name="the-navigation" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.avalon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.8s ease-out;
  overflow: hidden;

  .box_container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    font-family: $fontFamily9;
    font-family: $fontFamily7;
    // background-size: auto 140%;
    // background-image: url('@/assets/images/northern-lights-in-iceland.jpg');
    // background-position: 30% -100px;
    // background-size: 100% 100%;
    // background-image: url('@/assets/images/blue_bg_lisd_generic.jpg');
    // background-repeat: no-repeat;
    // background-position: 0% 0%;
    background-color: rgb(4, 20, 82);
    background-image: linear-gradient(rgb(0, 210, 255) 0%, rgb(24, 80, 153) 32%, rgb(4, 20, 82) 74%);
    @include overflowScrollingY;
  }

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    font-family: $fontFamily9;
    font-family: $fontFamily7;
    // background-size: auto 140%;
    // background-image: url('@/assets/images/northern-lights-in-iceland.jpg');
    // background-position: 30% -100px;
    // background-size: 100% 100%;
    // background-image: url('@/assets/images/blue_bg_lisd_generic.jpg');
    // background-repeat: no-repeat;
    // background-position: 0% 0%;
    background-color: rgb(4, 20, 82);
    background-image: linear-gradient(rgb(0, 210, 255) 0%, rgb(24, 80, 153) 32%, rgb(4, 20, 82) 74%);
  
    &::before {
      /*content: '';*/
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: $matrix1;
      transition: all 1.8s ease-out;
    }
  
    &.mounted {
      &::before {
        background-color: transparent;
      }
    }

  .button_box {
    position: fixed;
    bottom: 50px;
  }
}
</style>
