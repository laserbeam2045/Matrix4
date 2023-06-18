<script lang="ts" setup>
import { Ref } from 'vue'

import {
  getAuth,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'

import { initializeApp } from 'firebase/app'

// import { useAuth } from '@/composables/useAuth'
import { useFirestore } from '@/composables/useFirestore'
// import { config } from 'process';

const state = reactive({
  isEnterArrowed: false,
  authenticated: false,
  isDarkMode: false,
  inputState: 0,
  accessCode: '',
  codeName: '',
})

const { setUser } = useUser()
const { fetchUser, registerUser } = useFirestore()
// const { loginWithAnonymously, getUid } = useAuth()

// 入力欄のKeyEnter時の処理
// const signUp = async (e: KeyboardEvent) => {
//   const { uid } = user.value
//   const { inputText: codeName } = state
//   const client = useState('client')

//   if (uid && codeName && client.value === 'client') {
//     (e.target as HTMLInputElement).blur()
//     state.showInput = false
//     await registerUser({ uid, codeName })
//     redirect(codeName)
//   }
// }

const matrix = ref(null)

const redirect = () => {
  window.scrollTo(0, 0)
  // const r = useRouter()
  const a = useNuxtApp()
  const r = a.$router
  setTimeout(() => state.authenticated = true, 1000)
  setTimeout(() => state.isEnterArrowed = true, 2000)
  setTimeout(() => r.push('/main'), 3000)
}

const color: Ref<string> = useState('color')
const bgColor: Ref<string> = useState('bgColor')

const blackout = () => {
  color.value = '#42cbf8'
  bgColor.value = '#070b17'
  bgColor.value = '#0D0208'
  return new Promise((resolve) => setTimeout(() => {
    state.isDarkMode = true
    matrix.value.addEventListener('pause', () => {
      redirect()
    })
    resolve(1)
  }, 1000))
}

const formatDate = (dt: Date) => {
  const y = dt.getFullYear()
  const m = ('00' + (dt.getMonth() + 1)).slice(-2)
  const d = ('00' + dt.getDate()).slice(-2)
  return y + m + d
}

const onKeyEnterOne = (e: Event) => {
  if (state.accessCode === formatDate(new Date())) {
    (e.target as HTMLInputElement).blur()
    state.accessCode = ''
    state.inputState = 2
    blackout()
  } else {
    state.accessCode = ''
  }
}

const onKeyEnterTwo = async (e: Event) => {
  const { codeName } = state
  const auth = getAuth()

  if (codeName) {
    (e.target as HTMLInputElement).blur()
    state.inputState = 0
    await signOut(auth)
    await signInAnonymously(auth)
  }
}

const mounted = ref(false)

onMounted(async () => {
  const config = useRuntimeConfig()
  initializeApp(config.public.firebaseConfig)

  const auth = getAuth()

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const { uid } = user
      const userData = await fetchUser(uid)

      if (userData) {
        setUser(userData)
        await blackout()
        await redirect()
      } else if (state.codeName) {
        const { codeName } = state
        await registerUser({ uid, codeName })
        const userData = await fetchUser(uid)
        setUser(userData)
        redirect()
      } else {
        state.inputState = 1
      }
    } else if (state.codeName === '') {
      state.inputState = 1
    }
  })
  mounted.value = true
})
</script>

<template>
  <transition name="page" appear>
    <div
      v-if="mounted"
      id="signin"
    >
      <transition-group
        name="fade-input"
        mode="out-in"
        appear
      >
        <video
          v-show="state.isDarkMode"
          :key="123"
          ref="matrix"
          src="@/assets/videos/matrix.mp4#t=30.0,40.5"
          autoplay
          muted
          preload="auto"
          style="position: absolute; top: 50%; transform: translateY(-50%); width: 100vw; background: transparent;"
        />
      </transition-group>
      <div class="wrapper">
        <transition name="fade" appear>
          <div
            class="window"
            :class="{ authenticated: state.authenticated }"
            :style="{ color }"
          >
            <span class="background-wrapper">
              <span class="background" />
            </span>
            <span class="left-light" />
            <span class="right-light" />
            <span class="caption" :class="{ on: state.isDarkMode }">
              MATRIX
            </span>
          </div>
        </transition>
        <!-- <pre style="color: white;">{{ state }}</pre> -->
        <div style="margin: 48px 0 0;">
          <transition-group
            name="fade-input"
            mode="out-in"
            appear
          >
            <AppInputTextThree
              v-if="state.inputState === 1"
              v-model:value="state.accessCode"
              style="width: 200px;"
              placeholder="Access Code"
              :activate="false"
              @keydown.enter="onKeyEnterOne"
              />
            <AppInputTextThree
              v-if="state.inputState === 2"
              v-model:value="state.codeName"
              style="width: 200px;"
              placeholder="Your Code Name"
              :activate="state.isDarkMode"
              />
              <!-- @keydown.enter="onKeyEnterTwo" -->
          </transition-group>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
// * {
//   text-transform: uppercase;
//   -webkit-user-select: none;
//      -moz-user-select: none;
//       -ms-user-select: none;
//           user-select: none;
// }

#signin {
  position: relative;
  width: 100vw;
  height: 100vh;
  transition: all 1s ease-out;

  &.page-enter-from > .wrapper {
    opacity: 0;
  }
  &.page-enter-active > .wrapper {
    transition: all 1s ease-out .7s;
  }
  &.page-leave-to > .wrapper {
    opacity: 0;
    transform: translateX(-50%) translateY(-50px) !important;
  }

  .wrapper {
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    flex-direction: column;
    transition: all 1s ease-out;

    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }

    .fade-enter-active,
    .fade-leave-active {
      transition: all 1s ease-out;
    }

    .fade-input-enter-from,
    .fade-input-leave-to {
      opacity: 0;
    }

    .fade-input-enter-active {
      transition: all 1s ease-out 1s;
    }
    .fade-input-leave-active {
      transition: all 1s ease-out;
    }

    .window {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 220px;
      height: 35px;
      margin: 0;
      padding: 15px 0 0;
      color: #42cbf8;
      font: bold 15px/35px 'Orbitron',sans-serif;
    // letter-spacing: -9px;
    // font-family: $fontFamily10;

      .background-wrapper {
        display: block;
        position: absolute;
        left: 0;
        top: 8px;
        width: 220px;
        height: 35px;
        // color: #42cbf8;
        perspective: 145px;
        -webkit-perspective: 145px;
        // text-transform: uppercase;
        text-align: center;
        z-index: 0;

        .background {
          opacity: 0;
          display: block;
          width: 220px;
          height: 35px;
          border: solid #29648a;
          border-width: 1px 0;
          -webkit-transform: rotateX(-35deg) scaleY(1.4);
          transform: rotateX(-35deg) scaleY(1.4);
        }
        .background::before,
        .background::after {
          content: '';
          opacity: 0;
          display: block;
          position: absolute;
          height: 35px;
          background: #29648a;
          top: -1px;
          width: 8px;
        }
        .background::before { left: -1px; }
        .background::after { right: -1px; }
      }

      .left-light,
      .right-light {
        display: block;
        position: absolute;
        z-index: 0;
        top: -30px;
        width: 95px;
        height: 125px;
      }
      .left-light { left: -50px; }
      .right-light { right: -50px; }

      .left-light::before,
      .right-light::before {
        content: '';
        display: block;
        position: absolute;
        top: 32px;
        width: 8px;
        height: 43px;
      }
      .left-light::before {
        left: 47px;
        transform: skew(33deg);
      }
      .right-light::before {
        right: 47px;
        transform: skew(-33deg);
      }

      .caption {
        font-weight: bold;
        letter-spacing: 2px;
        transition: all 1s ease-out;
        font-size: 20px;
        font-family: $fontFamily10;
        color: transparent;
        -webkit-text-stroke: 1px #42cbf8;
      }
      .caption.on {
        text-shadow:
          rgba(0,112,202,0.5)  4px  3px 3px,
          rgba(0,112,202,0.5) -4px  3px 3px,
          rgba(0,112,202,0.5)  4px -1px 3px,
          rgba(0,112,202,0.5) -4px -1px 3px;
      }
    }

    .window.authenticated {

      .background {
        opacity: 1;
      }

      .background::before,
      .background::after {
        transition: all .5s;
        opacity: 1;
        background: #42cbf8;
      }

      .left-light::before,
      .right-light::before {
        transition: all .5s;
        box-shadow: 0px 0 25px 10px rgba(0,112,202,0.8);
      }

      .caption.on {
        text-shadow:
          rgba(0,112,202,0.5)  4px  3px 3px,
          rgba(0,112,202,0.5) -4px  3px 3px,
          rgba(0,112,202,0.5)  4px -1px 3px,
          rgba(0,112,202,0.5) -4px -1px 3px,
          rgba(0,90,255,0.66)  4px  4px 10px,
          rgba(0,90,255,0.66) -4px  4px 10px,
          rgba(0,90,255,0.66)  4px -4px 10px,
          rgba(0,90,255,0.66) -4px -4px 10px;
      }
    }
  }
}
</style>
