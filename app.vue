<script setup lang="ts">
import '@/assets/sass/main.scss'

// FontAwesome
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { library, dom } from '@fortawesome/fontawesome-svg-core'

library.add(fas, fab, far)

dom.watch()

const windowObject = useState('windowObject', () => ({
  innerWidth: 0,
  innerHeight: 0,
}))

const setWindowSize = () => {
  const { innerWidth, innerHeight } = window

  windowObject.value.innerWidth = innerWidth
  windowObject.value.innerHeight = innerHeight
}

onMounted(() => {
  setWindowSize()

  window.addEventListener('resize', setWindowSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', setWindowSize)
})
</script>

<template>
  <Html lang="en">
    <Head>
      <Meta charset="UTF-8" />
      <Meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0" />
      <Title>MATRIX</Title>
      <Link
        rel="icon"
        href="/favicon.png"
      />
      <Link
        rel="stylesheet"
        type="text/css"
        href="//fonts.googleapis.com/css?family=Roboto:100,200,300,400,500,600"
      />
      <Link
        rel="stylesheet"
        type="text/css"
        href="//fonts.googleapis.com/css?family=Electrolize|Orbitron:100,200,300,400,500,600"
      />
      <Link
        rel="stylesheet"
        type="text/css"
        href="//fonts.googleapis.com/css?family=Inconsolata|Roboto+Mono:100,200,300,400,500,600"
      />
      <Link
        rel="stylesheet"
        type="text/css"
        href="//fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600"
      />
      <Link
        rel="stylesheet"
        type="text/css"
        href="//fonts.googleapis.com/css2?family=Nunito:wght@100;200;300;400;500;600"
      />
      <!-- <Link
        rel="manifest"
        href="/_nuxt/manifest.webmanifest"
      /> -->
    </Head>
    <Body>
      <VitePwaManifest />
      <div id="layer-0" />
      <div id="layer-1">
        <NuxtPage />
        <!-- <NuxtLink to="/">Home page</NuxtLink> -->
      </div>
      <div id="layer-2" />
      <div id="layer-3" />
      <div id="layer-4" />
      <div id="layer-5" />
    </Body>
  </Html>
</template>

<style lang="scss" scoped>
  #layer-0 { color: #42cbf8; position: relative; z-index: 0;   }
  #layer-1 { color: #42cbf8; position: relative; z-index: 100; }
  #layer-2 { color: #42cbf8; position: absolute; z-index: 200; }
  #layer-3 { color: #42cbf8; position: absolute; z-index: 300; }
  #layer-4 { color: #42cbf8; position: absolute; z-index: 400; }
  #layer-5 { color: #42cbf8; position: absolute; z-index: 500; }

  #layer-1 {
    width: 100vw;
    height: 100vh;
  }
</style>
