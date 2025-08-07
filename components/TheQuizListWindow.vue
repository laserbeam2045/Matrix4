<script setup lang="ts">
import { Ref } from 'vue'

import { useBreakpoints } from '@vueuse/core'

import type { SortItem, QuizData } from '@/composables/useQuiz'

import type { TreeData, TreeOptions } from '@/composables/useTree'
import type { MovingNodeArguments } from '@/server/api/tree/moving-node'
import type { MovingTreeArguments } from '@/server/api/tree/moving-tree'
import { DRAG_MODE, DragMode } from '@/types/Draggable'

import AppItem from '@/components/AppItem.vue'

import { default as useTree, TreeState } from '@/composables/useTree'
import useTeleport from '@/composables/useTeleport'

const props = defineProps<{
  quizData: QuizData[]
  failedIds: number[]
  clearedIds: number[]
  sortConditions: SortItem[]
}>()

defineEmits<{
  quiz: []
  plus: []
  open: [payload: QuizData]
  touch: []
}>()

// const { mouseTouchEvent } = useEvent()

// const eventName = computed(() => mouseTouchEvent.value.START + 'Passive')

const breakpoints = useBreakpoints({
  tablet: 640,
  laptop: 1024,
  desktop: 1280,
})

const phone = breakpoints.smaller('tablet')
const tablet = breakpoints.between('tablet', 'laptop')
const laptop = breakpoints.between('laptop', 'desktop')
const desktop = breakpoints.greater('desktop')

const searchQuery = useState('searchQuery') as Ref<string>

const displayLimit = ref(100)

const slicedQuizData = computed(() => {
  return props.quizData.slice(0, displayLimit.value)
})

const onVisible = (index: number) => {
  if (index === displayLimit.value - 1) {
    displayLimit.value = Math.min(
      displayLimit.value + 100,
      totalQuizCount.value
    )
  }
}

const totalQuizCount = computed(() => props.quizData.length)

watch(totalQuizCount, () => {
  displayLimit.value = Math.min(100, totalQuizCount.value)
})

const mounted = ref(false)
const countFlg = ref(false)




type MoveInfo = (
  MovingNodeArguments |
  MovingTreeArguments
)

const { setLoading } = useMatrix()

const showNavigation = useState('showNavigation') as Ref<boolean>

showNavigation.value = false

const dragMode = ref<DragMode>(DRAG_MODE.NODE)

const treeOptions: TreeOptions = reactive({ dragMode })

const {
  rootId,
  treeData,
  treeMethods,
  treeHistory,
  isTreeLoading,
  isTreeOldData,
} = useTree()

const TREE_ROOT_ID = useState('TREE_ROOT_ID').value as string
const HOME_ROOT_ID = useState('HOME_ROOT_ID').value as string

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
  if (operationMode.value === 'TELEPORT' && payload.link.length === 16) {
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

const onUpdated = (update = true) => {
  console.table({ update })
  onFinished()
  setTimeout(() => {
    treeMethods.updateData(update)
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

watch(rootId, async (id) => {
  // useNuxtApp().$router.push(`/main/tree/${encodeURIComponent(id)}`)
  console.table({id})
  await treeMethods.changeRoot(id)
  await treeMethods.updateData()
})

watch(isTreeLoading, (isLoading) => {
  console.table({ isLoading })
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


onMounted(() => {
  mounted.value = true

  setTimeout(async () => {
    rootId.value = HOME_ROOT_ID

    await treeMethods.updateData(false)
  }, 100)
  setTimeout(() => countFlg.value = true, 20000)
})
</script>

<template>
  <div class="the_quiz_list" :class="{ phone, tablet, laptop, desktop }">
    <div
      v-if="quizData"
      class="query"
      style="display: flex; align-items: end;"
    >
      <AppInputTextTwo
        v-model:value.lazy="searchQuery"
        placeholder="Search Query"
        type="search"
        :dynamic="false"
        :outside="false"
        style="border-radius: 24px;"
      />
    </div>

    <!-- <AppGlowingIcon /> -->

    <div class="table_container mt-2">
      <table>
        <thead>
          <tr>
            <th>
              <AppTweenNumber :value="countFlg ? totalQuizCount: 0" /> results
              <AppButton style="margin-left: 8px; border-radius: 30px; padding: 0px; width: 30px; height: 30px;" @end.self="$emit('plus')">+</AppButton>
              <AppButton style="margin-left: 8px; border-radius: 30px; padding: 0px; width: 30px; height: 30px;" @end.self="$emit('quiz')">Q</AppButton>
            </th>
          </tr>
        </thead>

        <tbody style="position: relative;">
          <div style="width: 100%; position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; flex-wrap: wrap;">
            <!-- <AppScrollable height="80vh"> -->
              <transition-group name="list-complete">
                <tr
                v-for="(quiz, index) in slicedQuizData"
                :key="quiz.quiz_id"
                :style="`--delay: ${Math.min(1.0, index * 0.15)}s`"
                class="list_complete_item"
                >
                <td
                :class="{
                  failed: failedIds.includes(quiz.quiz_id),
                  cleared: clearedIds.includes(quiz.quiz_id),
                }"
                  @click="$emit('open', quiz)"
                  >
                  <span class="number">{{ index + 1 }}</span>
                  <TheSampleQuizListItem
                    :question="quiz.question"
                    :press-point="quiz?.push_point ?? 0"
                    @in="onVisible(index)"
                    />
                  </td>
                </tr>
              </transition-group>
            <!-- </AppScrollable> -->
          </div>
          
          <!-- <div id="the-sample-tree" style="position: absolute; left: 45%;">
              <AppScrollable height="80vh">
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
            </AppScrollable>
            </div> -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.the_quiz_list {
  text-align: center;
  height: 100vh;

  // 640 < width
  &.phone {
    width: 359px;

    .table_container {
      width: 359px;

      table {
        tr {
          td {
            width: 359px;
          }
        }
      }
    }
  }

  // 640 <= width <= 1024
  &.tablet {
    width: 624px;
    width: 99%;

    .table_container {
      width: 624px;
      // width: 359px;
      width: 99%;

      table {
        tr {
          td {
            width: 624px;
            width: 359px;
          }
        }
      }
    }
  }

  // 1024 <= width <= 1280
  &.laptop {
    width: 1008px;
    width: 624px;
    width: 100%;

    .table_container {
      width: 1008px;
      width: 624px;
      // width: 359px;
      width: 100%;

      table {
        tr {
          td {
            width: 1008px;
            width: 624px;
            width: 359px;
          }
        }
      }
    }
  }

  // 1280 < width
  &.desktop {
    width: 1264px;
    width: 624px;

    .table_container {
      width: 1264px;
      width: 624px;
      // width: 359px;

      table {
        tr {
          td {
            width: 1264px;
            width: 624px;
            width: 359px;
          }
        }
      }
    }
  }

  .hit {
    color: $textColor1;
    width: 128px;
    text-align: right;
    margin-left: auto;
    margin-right: auto;
    padding-right: 16px;
    @include unSelectable;
  }

  .table_container {
    height: 100%;
    position: relative;
    overflow-x: hidden;
    border-radius: 4px;
    @include overflowScrollingY;

    table {
      border-collapse: separate;
      position: absolute;
      top: -2px;
      left: -2px;
      padding: 0 0 240px;
      border-radius: 4px;
      width: 100%;

      thead {
        tr {
          th {
            position: sticky;
            top: 0px;
            padding: 12px;
            min-width: 331px;
            color: #eee;
            // background: rgba(1,9,39,0.85);
            background-clip: padding-box;
            // border: 1px solid #0c67a1;
            // font-family: $fontFamily1 !important;
            // border-color: $textColor1;
            // border-color: rgba(1,9,39,0.85);
            border-color: transparent;
            backdrop-filter: blur(3px);
            // background: rgba(19,67,141, 0.4);
            // background: linear-gradient(rgba(9,166,220, 0.4), rgba(10,152,209, 0.4));
            background: transparent;
            border-radius: 4px;
            color: #fff;
            @include textStyleC;
    // color: transparent;
    // -webkit-text-stroke: 1px transparent;

            z-index: 100;
            @include unSelectable;
          }
        }
      }

      tr {
        td {
          margin: 8px 0 0;
          padding: 16px 16px 16px 0;
          cursor: pointer;
          // background-clip: padding-box;
          // background: rgba(1,9,19,0.66);
          background: rgba(0,0,0,0.4);
          border: 1px solid #0c67a1;
          border-radius: 4px;
          // border-color: $textColor2;
          // border-color: $textColor1;
          border-color: transparent;
          display: flex;
          align-items: center;
          justify-content:center;

//          color: rgb(24,234,205);
          // backdrop-filter: blur(3px);
          background-color: rgba(34,198,213, 0.15);
          // box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
          border: 1px rgba(255,255,255,0.4) solid;

          &.failed {
            color: #f66;
            border-color: #f00;
          }

          &.cleared {
            color: $matrix4;
            border-color: $matrix4;
            // background: $matrix3;
          }

          .number {
            align-self: stretch;
            display: block;
            margin: 0px 0;
            padding: 16px;
            height: auto;
            display: flex;
            align-items: center;
            border-right: 1px solid skyblue;
            color: $textColor1;
            color: rgb(107,188,191);
            color: skyblue;
            @include textStyleC;
          }
        }
      }
    }
  }
}

.list_complete_item {
  transition: all 0.8s ease-out;
  display: inline-block;
}

.list-complete-enter-active {
  $delay: var(--delay);
  transition: all 0.8s $delay ease-out;
}

.list-complete-leave-active {
  // background-color: #000;
  position: absolute;
  // top: 0;
  left: 0;
  height: 0;
  opacity: 0;
}

.list-complete-enter-from {
  transform: translateX(300px);
  opacity: 0;
}

.list-complete-leave-to {
  opacity: 0;
  height: 0;
}
</style>
