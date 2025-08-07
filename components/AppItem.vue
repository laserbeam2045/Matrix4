<template>
  <div class="app-item" :class="{ new: isNew, content: isContent }">
    {{ props.treeData.txt }}
  </div>
</template>

<script lang="ts" setup>
import type { TreeData } from '@/composables/useTree'

const props = defineProps<{
  treeData: TreeData
}>()

const isNew = computed(() => {
  const now = new Date()
  const updated = new Date(props.treeData.updatedAt)
  return (
    (now.getTime() - updated.getTime()) < 86400000
  )
})

const isContent = computed(() => {
  return props.treeData.text
})
</script>

<style lang="scss" scoped>
.app-item {
  display: inline-block;
  padding: 7px 9px;
  font-size: 14px;
  //color: $textColor4;
  color: #42cbf8;
  white-space: nowrap;
  background: #001c26;
  border: 1px solid;
  border-radius: 5px;
  font-family: $fontFamily9;
  @include unSelectable;

  $ca: #42cbf8;
  $cb: #00f3ff;

  &.reflect {
    // -webkit-box-reflect: below 1px -webkit-gradient(linear, left bottom, left top, from(rgba(0,0,255,0.15)), to(transparent));
    // border-radius: 12px;
    // backdrop-filter: blur(2px);
    // background-color: rgba(34,198,213, 0.15);
    // box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
    // border: 1px rgba(255,255,255,0.4) solid;
    // color: #fff;
    // font-family: $fontFamily5;
    // text-shadow:
    //   +8px  4px 10px rgba(0,90,255,0.66),
    //   -8px -4px 10px rgba(0,90,255,0.66),
    //   -8px  4px 10px rgba(0,90,255,0.66),
    //   +8px -4px 10px rgba(0,90,255,0.66);
    // box-shadow: 0 2px 16px -4px $ca;
    // border-color: rgba(255,255,255,0.4);
    -webkit-box-reflect: below 1px -webkit-gradient(linear, left bottom, left top, from(rgba(0,0,255,0.1)), to(transparent));

    // &:hover {
    //   transform: translateY(-5px);
    // }
  }

@keyframes animate
{
  0%
  {
    filter: hue-rotate(0deg);
  }
  100%
  {
    filter: hue-rotate(360deg);
  }
}

  &:hover {
    cursor: pointer;
  }
  // &:active {
  //   cursor: grabbing;
  // }
  &.active {
    color: orange;
    text-shadow: none;
  }

  &.content {
    color: rgb(41, 253, 252);
    //filter: hue-rotate(270deg);
    border-radius: 12px;
    backdrop-filter: blur(3px);
    background-color: rgba(7, 73, 120, 5.15);
    // box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
    border: 1px rgba(255,255,255,0.4) solid;
  }

  &.link {
    text-shadow:
      0 0 16px $ca;
    overflow: hidden;
    // color: white;
    border-color: #42cbf8;
    filter: hue-rotate(270deg);
    //animation: animate 4s linear infinite;
  }

  //&.new {
  //  filter: hue-rotate(270deg);
  //  animation: animate 4s linear infinite;
  //}
}
</style>
