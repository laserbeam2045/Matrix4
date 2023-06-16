<script lang="ts">
export default {
  layout: 'the-matrix-code',
}
</script>

<script setup lang="ts">
import { Ref } from 'vue'

const bgColor: Ref<string> = useState('bgColor')

bgColor.value = '#0D0208'

</script>

<template>
  <div>
    q   a
  </div>
</template>

<style lang="scss" scoped>

</style>
