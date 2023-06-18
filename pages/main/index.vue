<script lang="ts" setup>
const { user } = useUser()
const { setInfo } = useMatrix()

const getMessage = () => {
  const rand = Math.random()
  if (rand < 0.1) return `Banjimasite ${user.value.codeName}`  // 日本語(出雲弁)
  if (rand < 0.2) return `Hola ${user.value.codeName}`         // スペイン語
  if (rand < 0.3) return `Hello ${user.value.codeName}`        // 英語
  if (rand < 0.4) return `Jambo ${user.value.codeName}`        // スワヒリ語(ケニア／ウガンダ／タンザニア)
  if (rand < 0.5) return `Bonjour ${user.value.codeName}`      // フランス語
  if (rand < 0.6) return `Xin chào ${user.value.codeName}`     // ベトナム語
  if (rand < 0.7) return `Guten tag ${user.value.codeName}`    // ドイツ語
  if (rand < 0.8) return `Buon giorno ${user.value.codeName}`  // スペイン語
  if (rand < 0.9) return `Здравствуйте ${user.value.codeName}` // ロシア語
  return `${user.value.codeName} السلام عليكم`
}

onMounted(() => {
  setTimeout(() => setInfo(getMessage()), 1000)
  // setPageLayout('the-matrix')
})
</script>

<template>
  <!-- <div></div> -->
  <NuxtLayout name="the-matrix" />
      <!-- <NuxtLayout name="the-header" />
      <NuxtLayout name="the-loading" />
      <NuxtLayout name="the-navigation" /> -->
</template>

<style lang="scss" scoped>
</style>
