<script lang="ts" setup>
const { matrix } = useMatrix()
</script>

<template>
  <div style="display: none;">
    <teleport to="#layer-4">
      <transition name="fade">
        <section v-if="matrix.isLoading" id="app-loading">
          <div class="circle">
            <span class="ball" style="--i:0;" />
            <span class="ball" style="--i:1;" />
            <span class="ball" style="--i:2;" />
            <span class="ball" style="--i:3;" />
            <span class="ball" style="--i:4;" />
            <span class="ball" style="--i:5;" />
            <span class="ball" style="--i:6;" />
            <span class="ball" style="--i:7;" />
            <span class="ball" style="--i:8;" />
            <span class="ball" style="--i:9;" />
            <span class="ball" style="--i:10;" />
            <span class="ball" style="--i:11;" />
            <span class="ball" style="--i:12;" />
            <span class="ball" style="--i:13;" />
            <span class="ball" style="--i:14;" />
            <span class="ball" style="--i:15;" />
            <span class="ball" style="--i:16;" />
            <span class="ball" style="--i:17;" />
            <span class="ball" style="--i:18;" />
            <span class="ball" style="--i:19;" />
            <span class="ball" style="--i:20;" />
          </div>
          <h2 class="message">
            <span class="char">L</span>
            <span class="char">o</span>
            <span class="char">a</span>
            <span class="char">d</span>
            <span class="char">i</span>
            <span class="char">n</span>
            <span class="char">g</span>
            <span class="char">...</span>
          </h2>
        </section>
      </transition>
    </teleport>
  </div>
</template>

<style lang="scss" scoped>
#app-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  // background: #042104;
  // background: rgba(4,33,4,0.6);
  backdrop-filter: blur(2px);
  background-color: rgba(0,61,125, 0.33);
  animation: animateBg 10s linear infinite;
  @include unSelectable;

  @keyframes animateBg {
    0% {
      filter: hue-rotate(0deg);
    }
    100% {
      filter: hue-rotate(360deg);
    }
  }

  @keyframes animateBall
  {
    0% {
      transform: scale(1);
    }
    80%,
    100% {
      transform: scale(0);
    }
  }

  @keyframes loading {
    0%,
    100% {
      color: $white;
      text-shadow:
        0 0 5px $blue-bolt,
        0 0 10px $blue-bolt,
        0 0 20px $blue-bolt,
        0 0 40px $blue-bolt;
      filter: blur(2px);
    }
    25%,
    75% {
      color: transparent;
      text-shadow: none;
      filter: blur(0);
    }
  }

  .circle {
    position: relative;
    width: 120px;
    height: 120px;

    .ball {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: rotate(calc(18deg * var(--i)));

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: #00ff0a;
        box-shadow:
          0 0 10px #00ff0a,
          0 0 20px #00ff0a,
          0 0 40px #00ff0a,
          0 0 60px #00ff0a,
          0 0 80px #00ff0a,
          0 0 100px #00ff0a;
        animation: animateBall 2s linear infinite;
        animation-delay: calc(0.1s * var(--i));
      }
    }
  }

  .message {
    margin-top: 64px;
    font-size: 3rem;
    font-family: $fontFamily3;

    .char {
      animation: loading 3s linear infinite;

      @for $i from 1 through 8 {
        &:nth-child(#{$i}) {
          animation-delay: #{$i * 0.1}s;
        }
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.33s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  display: none !important;
}
</style>
