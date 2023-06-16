<script setup lang="ts">
import {
  getAuth,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth'

import { useFirestore } from '@/composables/useFirestore'

onMounted(() => {
  const auth = getAuth()
  const router = useRouter()

  if (isSignInWithEmailLink(auth, window.location.href)) {
    const email = window.localStorage.getItem('emailForSignIn')

    if (email) {
      signInWithEmailLink(auth, email, window.location.href)
        .then(async (result) => {
          const { user } = result
          const { uid, email } = user
          const { setUser } = useUser()
          const { fetchUser, updateUser } = useFirestore()

          window.localStorage.removeItem('emailForSignIn')
          await updateUser({ uid, email })
          const userData = await fetchUser(uid)
          console.log(userData)
          setUser(userData)
          // router.push('/main/conf')
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      router.push('/')
    }
  } else {
    router.push('/')
  }
})
</script>

<template>
  <p />
  <!-- <NuxtLayout v-if="mounted" name="the-matrix-code" /> -->
</template>
