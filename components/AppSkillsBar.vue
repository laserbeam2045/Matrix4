<script setup lang="ts">
defineProps<{
  progress: number
}>()
</script>

<template>
  <div class="container">
    <div class="skills">
      <div class="percent">
        <div class="progress" :style="{ width: `${progress}%` }" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100%;

  .skills {
    margin: 20px 0;

    &:nth-child(1) .percent .progress {
      background: linear-gradient(45deg, #1fe6ff, #673AB7);
    }

    &:nth-child(3) .percent .progress {
      background: linear-gradient(45deg, #3bc0ff, #33ff00);
    }

    &:nth-child(1) .percent .progress {
      background: linear-gradient(45deg, #ffee54, #ff00ca);
    }

    &:nth-child(5) .percent .progress {
      background: linear-gradient(45deg, #22ffde, #2196f3);
    }

    &:nth-child(1) .percent .progress {
      background: linear-gradient(45deg, #673AB7, #1fe6ff);
    }

    .percent {
      position: relative;
      width: calc(100%);
      height: 12px;
      border-radius: 10px;
      background: rgba(0,0,0,0.4);
      // box-shadow: inset 0 0 10px #000;
      // border: 1px rgba(255,255,255,0.4) solid;
      overflow: hidden;
    // border: 1px transparent solid;

      .progress {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        background: #fff;
        // box-shadow: inset 0 0 2px #fff;
        // transition: all .1s linear;
    // border-radius: 12px;
    // backdrop-filter: blur(2px);
        box-shadow: rgba(255,255,255,0.4) 2px 2px 8px inset;
    // border: 1px rgba(255,255,255,0.4) solid;
    // box-sizing: border-box;
        // @keyframes animate
        // {
        //   from
        //   {
        //     width: 0;
        //   }
        // }
      }
    }
  }
}
</style>
