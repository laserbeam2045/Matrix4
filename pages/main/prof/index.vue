<script lang="ts">
export default {
  layout: 'the-matrix',
}
</script>

<script setup lang="ts">
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth'

const auth = getAuth()

const actionCodeSettings = {
  url: 'http://192.168.3.13:3000/login',
  handleCodeInApp: true,
}

const email = ref('')

const loginActive = ref(false)

const emailActive = ref(false)

const mounted = ref(false)

const submit = () => {
  sendSignInLinkToEmail(auth, email.value, actionCodeSettings)
    .then(() => {
      window.localStorage.setItem('emailForSignIn', email.value)
      window.alert('check your email')
    })
    .catch((error) => {
      const { code, message } = error
      console.table({ code })
      console.table({ message })
    })
}

onMounted(() => {
  const { setInfo } = useMatrix()

  setInfo('Coming Soon...')

  if (isSignInWithEmailLink(auth, window.location.href)) {
    const email = window.localStorage.getItem('emailForSignIn')
    if (email) {
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          const { user } = result
          const { uid, email } = user
          window.localStorage.removeItem('emailForSignIn')
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      loginActive.value = true
    }
  } else {
    loginActive.value = true
  }

  setTimeout(() => {
    mounted.value = true
  }, 2100)
})
</script>

<template>
  <div
    class="the_prof"
    :class="{ mounted }"
  >
    <div
      v-if="loginActive && false"
    >
      <AppButton @end.self="emailActive = true">With Email</AppButton>
    </div>

    <AppWindowModal
      :is-visible="emailActive"
      :offset="1.2"
      legend="Login"
    >
      <div class="container mt-6 px-4 pb-4">
        <div class="body" style="width: 240px;">
          <AppInputTextTwo
            v-model:value="email"
            v-focus
            height="38px"
            placeholder="Email Address"
          />
        </div>
        <div class="buttons flex justify-evenly mt-6">
          <AppButton class="button" @end.self="emailActive = false">CANCEL</AppButton>
          <AppButton class="button" @end.self="submit">Submit</AppButton>
        </div>
      </div>
    </AppWindowModal>
  </div>
</template>

<style lang="scss" scoped>
.the_prof {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: $fontFamily9;
  // background-size: auto 140%;
  // background-image: url('@/assets/images/northern-lights-in-iceland.jpg');
  // background-position: 30% -100px;
  background-size: 100% auto;
  background-image: url('@/assets/images/blue_bg_lisd_generic.jpg');
  background-repeat: no-repeat;
  background-position: 0% 0%;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    touch-action: none;
    background-color: $matrix1;
    transition: all 1.8s ease-out;
    z-index: -1;
  }

  &.mounted {
    &::before {
      background-color: transparent;
    }
  }

  * {
    font-family: $fontFamily9;
  }
}
</style>
