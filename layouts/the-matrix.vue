<script setup lang="ts">
import { getAuth } from 'firebase/auth'

const { $router } = useNuxtApp()

const { user } = useUser()

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

const auth = getAuth()

const showNavigation = useState('showNavigation')

onMounted(() => {
  const user = auth.currentUser
  console.log(user)
  // if (user === null) {
  // if (!user.value.codeName) {
  //   $router.push('/')
  // } else {
  //   console.table({ user })
  // }
  console.table({ user })
  showNavigation.value = true
})
</script>

<template>
  <div id="matrix">
    <div v-if="user.codeName || true" class="contents">
      <NuxtLayout name="the-header" />
      <NuxtLayout name="the-loading" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
#matrix {
  position: relative;
  width: 100vw;
  height: 100vh;
  font-family: 'Electrolize', sans-serif;

  .contents {
    position: relative;
    box-sizing: border-box;
    width: 100vw;
    height: 100vh;
    padding: 128px 0 128px;
    position: relative;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    z-index: 0;

    &::-webkit-scrollbar {
      display: none;
    }

    // .config {
    //   background: #070b17;
    //   background: rgba(7, 11, 23, 0.75);
    //   display: flex;
    //   flex-direction: column;
    //   align-items: flex-start;
    //   flex-shrink: 0;
    //   position: fixed;
    //   top: 0;
    //   left: 0;
    //   right: 0;
    //   padding: 40px 24px 24px;
    //   z-index: 3;
    // }
  }
}
</style>
