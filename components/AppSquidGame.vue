<script setup lang="ts">
withDefaults(defineProps<{
  icon: string
  color?: string
  width?: number | string
  height?: number | string
  viewBox?: string
  active?: boolean
}>(), {
  color: null,
  width: 64,
  height: 64,
  viewBox: '0 0 512 512',
  active: true,
})
</script>

<template>
  <div
    class="app_squid_game"
    :class="{ active }"
    :style="`--color: ${color ?? (icon === 'x' ? '#ea4884' : '#00b3ff')}`"
  >
    <AppIcon
      :width="width"
      :height="height"
      :viewBox="viewBox"
    >
      <IconAI v-if="icon === 'ai'" />
      <IconAlphaQ v-if="icon === 'q'" />
      <IconAlphaO v-if="icon === 'o'" />
      <IconAlphaX v-if="icon === 'x'" />
      <IconBook v-if="icon === 'book'" />
      <IconCode v-if="icon === 'code'" />
      <IconNull v-if="icon === 'null'" />
      <IconTree v-if="icon === 'tree'" />
      <IconVolume v-if="icon === 'volume'" />
      <IconVolumeMute v-if="icon === 'mute'" />
      <IconPhoenix v-if="icon === 'phoenix'" />
    </AppIcon>
  </div>
</template>

<style lang="scss" scoped>
$color: var(--color);

.app_squid_game {
  color: inherit;

  &.active {
    filter:
      drop-shadow(0 0 4px $color)
      drop-shadow(0 0 8px $color)
      drop-shadow(0 0 16px $color)
      drop-shadow(0 0 32px $color);
  }
}
</style>
