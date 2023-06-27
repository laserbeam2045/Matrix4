<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TreeData, TreeOptions } from '@/composables/useTree'
import type { MovingNodeArguments } from '@/server/api/tree/moving-node'
import type { MovingTreeArguments } from '@/server/api/tree/moving-tree'
import { DRAG_MODE, DragMode } from '@/types/Draggable'

import AppItem from '@/components/AppItem.vue'

import { default as useTree, TreeState } from '@/composables/useTree'
import useTeleport from '@/composables/useTeleport'

type MoveInfo = (
  MovingNodeArguments |
  MovingTreeArguments
)

const { setLoading } = useMatrix()

const showNavigation = useState('showNavigation') as Ref<boolean>

showNavigation.value = false

const dragMode = ref<DragMode>(DRAG_MODE.EDGE)

const treeOptions: TreeOptions = reactive({ dragMode })

// 取得された木構造のデータと操作メソッド
const {
  rootId,
  treeData,
  treeMethods,
  treeHistory,
  isTreeLoading,
  isTreeOldData,
} = useTree()

watch(rootId, async (id) => {
  useNuxtApp().$router.push(`/main/tree/${encodeURIComponent(id)}`)
})

const canceledCount = ref(0)

const about = useState('about', () => null)

const operationMode = useState('treeMode')

// const teleportInfo = ref<TeleportInfo | null>(null)

const {
  teleportInfo,
  isSendable,
} = useTeleport()

// アイテムをDnDで移動した時のイベントハンドラ
const onMoveItem = (payload: MoveInfo) => {
  if (treeOptions.dragMode === DRAG_MODE.EDGE) {
    const { cID, pID, idx } = payload
    teleportInfo.value.index = idx
    teleportInfo.value.departure = cID
    teleportInfo.value.destination = pID

    if (isSendable.value) {
      teleportInfo.value.state = 'SENDABLE'
    }
  }
}

// アイテムのクリックイベントハンドラ
const onTouchItem = async (payload: TreeData) => {
  if (operationMode.value === 'DISPLAY' && payload.link.length === 16) {
    teleportInfo.value.destination = payload.link
    teleportInfo.value.state = 'SENDABLE'
    return
  }
  if (treeOptions.dragMode === DRAG_MODE.EDGE) {
    about.value = payload
  }
}

// アイテムの開閉イベントハンドラ
const onChangeOpen = async (payload: TreeData) => {
  const { id, childrenCount } = payload
  if (0 < childrenCount) {
    await treeMethods.changeOpen({ id })
    await treeMethods.updateOpen({ id })
  }
}

const onUpdated = () => {
  onFinished()
  setTimeout(() => {
    treeMethods.updateData()
  }, 100)
}

const onFinished = () => {
  about.value = null
  // resetTeleportInfo()
}

const onCanceled = () => {
  canceledCount.value++
  console.log('canceled: ' + canceledCount.value)
}

watch(isTreeLoading, (isLoading) => {
  setLoading(isLoading)
})

const route = useRoute()

const treeState = useState('treeState') as Ref<TreeState>

const factions = computed(() => treeState.value.display.factions)

const sensor = computed(() => treeState.value.display.sensors)

const appTreeAlpha = resolveComponent('AppTreeAlpha')
const appTreeBeta = resolveComponent('AppTreeBeta')
const appTreeGamma = resolveComponent('AppTreeGamma')

const treeComponent = computed(() => {
  switch (sensor.value) {
  case 'lifeforms': return appTreeAlpha
  case 'economy': return appTreeBeta
  case 'crime': return appTreeGamma
  }
})

const mounted = ref(route.params.id !== 'home')

onMounted(async () => {

  const { setInfo } = useMatrix()

  setInfo('')
  setLoading(true)

  if (route.params.id === 'home') {
    setTimeout(async () => {
      await treeMethods.changeRoot('ozmkiRCEBnh7ZT83') // 本番環境
      // await treeMethods.changeRoot('9FGOQhg2IodypRvq')
      mounted.value = true
    }, 2100)
  } else {
    await treeMethods.updateData()

    setTimeout(() => {
      isTreeOldData.value = false
    }, 100)
  }
})
</script>

<template>
  <div>
    <div class="bg" :class="{ mounted }" />
    <div id="the-sample-tree">
      <div id="tree-container" :class="{ lifeforms: sensor === 'lifeforms', economy: sensor === 'economy', crime: sensor === 'crime' }">
        <transition :appear="true">
          <div v-if="!isTreeOldData">
            <component
              :is="treeComponent"
              :tree-data="treeData"
              :tree-options="treeOptions"
              :item-component="AppItem"
              @moveItem="onMoveItem"
              @touchItem="onTouchItem"
              @changeOpen="onChangeOpen"
            />
          </div>
        </transition>
        <TheSampleTreeModal
          :tree-methods="treeMethods"
          @update="onUpdated"
          @finish="onFinished"
          @cancel="onCanceled"
        />
      </div>
    </div>
    <NuxtLayout
      name="the-footer"
      :tree-methods="treeMethods"
      :tree-history="treeHistory"
    />
    <NuxtLayout name="the-header" />
    <NuxtLayout name="the-loading" />
  </div>
</template>

<style lang="scss" scoped>
* {
  transition: all .3s ease-out;
}

#the-sample-tree {
  display: flex;
  min-height: 100vh;
  min-width: 100vw;
  // backdrop-filter: blur(2px);
  // background-color: rgba(0,61,125, 0.33);

  #tree-container {
    padding: 80px max(16px, 5%) 185px;
    margin: 0;
    flex-shrink: 0;

    &.economy {
      margin: 0 auto;
    }
  }
}

    // .v-enter-active,
    // .v-leave-active {
    //   transition: all .3s ease-out !important;
    // }

    .v-enter-from {
      opacity: 0;
      transform: scale(1);
    }

    .v-leave-to {
      opacity: 0;
      transform: scale(1.1);
    }

    .v-enter-to,
    .v-leave-from {
      opacity: 1;
      transform: scale(1);
    }

.bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // background-size: 100% 100%;
  // background-image: url('@/assets/images/blue_bg_lisd_generic.jpg');
  // background-repeat: no-repeat;
  // background-position: 0% 0%;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $matrix1;
    transition: all 1.8s ease-out;
  }

  &.mounted {
    &::before {
      background-color: rgb(5, 38, 78);
      // background-color: transparent;
    }
  }
}
</style>
