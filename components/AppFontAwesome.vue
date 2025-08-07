<template>
  <fa class="app-font-awesome" :icon="icon" />
</template>

<script lang="ts" setup>
const props = defineProps<{
  prefix?: string
  iconName: string
}>()

const set = computed(() => {
  switch (props.iconName) {
  case 'quora':
  case 'google':
  case 'android':
  case 'codepen':
  case 'old-republic':
  case 'xing':
  case 'phoenix-framework':
  case 'phoenix-squadron':
    return 'fab'
  case 'lightbulb':
  case 'copy':
  case 'clone':
    return 'far'
  default:
    return 'fas'
  }
})

const icon = computed(() => ([
  props.prefix || set.value,
  props.iconName,
]))
</script>

<style lang="scss" scoped>
.app-font-awesome {
  cursor: pointer;
  font-weight: normal;
}
</style>
