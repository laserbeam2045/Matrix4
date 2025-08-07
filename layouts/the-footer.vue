<!-- <script lang="ts">
export default {
  inheritAttrs: false,
}
</script> -->

<script lang="ts" setup>
import type {
  TreeMethods,
  TreeHistory,
  TreeState,
} from '@/composables/useTree'

import useTeleport from '@/composables/useTeleport'

// import { useAudio, AUDIOS } from '@/composables/useAudio'

import useEvent from '@/composables/useEvent'

type OperationMode = 'SEARCH' | 'BOOKMARKS' | 'TELEPORT' | 'DISPLAY'

const operationMode = useState('treeMode') as Ref<OperationMode>

const {
  treeMethods,
  treeHistory,
} = defineProps<{
  treeMethods: TreeMethods
  treeHistory: TreeHistory
}>()

// const emit = defineEmits<{
//   departure: []
// }>()

// const showNavigation = useState('showNavigation')

// const handleNavigation = (e: Event) => {
//   if ((e.target as HTMLElement).scrollLeft === 0) {
//     showNavigation.value = true
//   } else {
//     showNavigation.value = false
//   }
// }
const showNavigation = useState('showNavigation') as Ref<boolean>

const treeState = useState('treeState') as Ref<TreeState>

const onSearchInput = () => {
  if (treeState.value.search.result.length === 0) {
    treeState.value.search.showWindow = false
  }
}

const searchNodes = async () => {
  const { word } = treeState.value.search
  const response = await treeMethods.searchNodes({ word })
  treeState.value.search.result = response
  treeState.value.search.showWindow = true
}

const {
  teleportInfo,
  isSendable,
} = useTeleport()

const onDeparture = () => {
  if (isSendable.value) {
    teleportInfo.value.state = 'SENDABLE'
  }
}

const clipboardData = useState('clipboardData')

const paste = (where: 'departure' | 'destination') => {
  const data = clipboardData.value as string
  if (teleportInfo.value[where] === data) {
    teleportInfo.value[where] = ''
  } else {
    teleportInfo.value[where] = data
  }
}

// const { playAudio } = useAudio()

// const activateSound = () => playAudio(AUDIOS.ETC.ACTIVATE)
// const deactivateSound = () => playAudio(AUDIOS.ETC.DEACTIVATE)

const playSound = (e: Event) => e
// (e.target as HTMLInputElement).checked ? activateSound() : deactivateSound()

const { mouseTouchEvent } = useEvent()

const eventName = computed(() => `${mouseTouchEvent.value.START}`)

const changeMode = (mode: OperationMode) => {
  if (operationMode.value !== mode) {
    operationMode.value = mode
    if (mode === 'SEARCH' && treeState.value.search.result.length === 0) {
      treeState.value.search.showWindow = false
    }
    // playAudio(AUDIOS.ETC.CYBER_14_1)
  }
}

const windowObject = useState('windowObject') as Ref<{
  innerWidth: number
  innerHeight: number
}>

const minWidth = computed(() => {
  return (
    operationMode.value === 'SEARCH'
      ? 612
      : operationMode.value === 'TELEPORT'
        ? 712
        : operationMode.value === 'DISPLAY'
          ? 712
          : 712
  )
})

const maxWidth = computed(() => {
  return Math.max(minWidth.value, windowObject.value.innerWidth)
})

const maxRight = computed(() => {
  return Math.min(0, windowObject.value.innerWidth - maxWidth.value)
})
</script>

<template>
  <teleport to="#layer-2">
    <div
      id="sm-controls-region"
      :style="`
        --maxWidth: ${maxWidth}px;
        --minWidth: ${minWidth}px;
        --maxRight: ${maxRight}px;
      `"
    >
      <div id="sm-controls-tabs-region">
        <ul class="sm-tabs">
          <li :class="{ 'sm-active': operationMode === 'SEARCH' }">
            <a @[eventName].passive="changeMode('SEARCH')">
              <span v-if="windowObject.innerWidth > 500">Search</span>
              <span v-else style="width: 20%; display: inline-block; text-align: center;">
                <AppFontAwesome icon-name="search" />
              </span>
            </a>
          </li>
          <li :class="{ 'sm-active': operationMode === 'TELEPORT' }">
            <a @[eventName].passive="changeMode('TELEPORT')">
              <span v-if="windowObject.innerWidth > 500">Teleport</span>
              <span v-else style="width: 20%; display: inline-block; text-align: center;">
                <AppFontAwesome icon-name="random" />
              </span>
            </a>
          </li>
          <li :class="{ 'sm-active': operationMode === 'DISPLAY' }">
            <a @[eventName].passive="changeMode('DISPLAY')">
              <span v-if="windowObject.innerWidth > 500">Display</span>
              <span v-else style="width: 20%; display: inline-block; text-align: center;">
                <AppFontAwesome icon-name="tv" />
              </span>
            </a>
          </li>
        </ul>
      </div>
      <section class="sm-controls">
        <!-- <pre style="position: fixed; top: 50px; left: 100px; color: white;">{{ treeHistory }}</pre> -->

        <template v-if="operationMode === 'SEARCH'">
          <div id="sm-controls-tab-content-region">
            <div class="sm-search-tab">
              <div class="sm-types">
                <label>Filters</label>
                <ul>
                  <li>
                    <input
                      id="type-bs"
                      v-model="treeState.search.filters[0]"
                      name="types"
                      type="checkbox"
                      value="BS"
                      @change="playSound"
                    >
                    <label for="type-bs">
                      <span style="left: 33px;"> Star System</span>
                    </label>
                  </li>
                  <li>
                    <input
                      id="type-bo"
                      v-model="treeState.search.filters[1]"
                      name="types"
                      type="checkbox"
                      value="BO"
                      @change="playSound"
                    >
                    <label for="type-bo">
                      <span style="left: -38px;"> Celestial Body</span>
                    </label>
                  </li>
                </ul>
              </div>
              <div class="sm-search" :class="{ active: treeState.search.word }">
                <div class="sm-field">
                  <label for="jquery">Search</label>
                  <div class="sm-input-container">
                    <input
                      id="jquery"
                      v-model="treeState.search.word"
                      type="text"
                      placeholder=""
                      spellcheck="false"
                      autocomplete="off"
                      @input="onSearchInput"
                      @keydown.enter="searchNodes"
                    >
                  </div>
                  <button type="button" class="sm-search-autocomplete">
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <TheFooterSearchResult
            :tree-methods="treeMethods"
            :search-result="treeState.search.result"
            :is-visible="treeState.search.showWindow"
            @close="treeState.search.showWindow = false"
          />
          <!-- <TheFooterBookMarks
            :tree-methods="treeMethods"
            :is-visible="treeState.search.showWindow"
            @close="treeState.search.showWindow = false"
          /> -->
        </template>

        <template v-else-if="operationMode === 'TELEPORT'">
          <div id="sm-controls-tab-content-region">
            <div class="sm-teleport-tab">
              <div class="sm-teleport">
                <div class="sm-departure-region">
                  <div>
                    <div
                      class="sm-field"
                      :class="{ active: teleportInfo.departure.length === 16 }"
                    >
                      <label>Departure</label>
                      <div class="sm-input-container">
                        <input
                          v-model="teleportInfo.departure"
                          type="text"
                          spellcheck="false"
                          autocomplete="off"
                          @[eventName].self.prevent="paste('departure')"
                        >
                      </div>
                      <!-- <button type="button" class="sm-search-autocomplete"><span>Search</span></button> -->
                    </div>
                    <ul class="sm-results-region sm-active" />
                  </div>
                </div>
                <div class="sm-destination-region">
                  <div>
                    <div
                      class="sm-field"
                      :class="{ active: teleportInfo.destination.length === 16 }"
                    >
                      <label>Destination</label>
                      <div class="sm-input-container">
                        <input
                          v-model="teleportInfo.destination"
                          type="text"
                          spellcheck="false"
                          autocomplete="off"
                          @[eventName].self.prevent="paste('destination')"
                        >
                      </div>
                      <!-- <button type="button" class="sm-search-autocomplete"><span>Search</span></button> -->
                    </div>
                    <ul class="sm-results-region sm-active" />
                  </div>
                </div>
                <!-- <div class="sm-ship-size">
                  <label>Ship size</label>
                  <ul>
                    <li>
                      <input
                        id="size-S"
                        v-model="treeState.teleport.shipSize"
                        name="ship-size"
                        type="radio"
                        value="S"
                        @change="playSound"
                      >
                      <label for="size-S" title="Small"><span>Small</span></label>
                    </li>
                    <li>
                      <input
                        id="size-M"
                        v-model="treeState.teleport.shipSize"
                        name="ship-size"
                        type="radio"
                        value="M"
                        @change="playSound"
                      >
                      <label for="size-M" title="Medium"><span>Medium</span></label>
                    </li>
                    <li>
                      <input
                        id="size-L"
                        v-model="treeState.teleport.shipSize"
                        name="ship-size"
                        type="radio"
                        value="L"
                        @change="playSound"
                      >
                      <label for="size-L" title="Large"><span>Large</span></label>
                    </li>
                  </ul>
                </div> -->
                <div
                  class="sm-actions"
                  style="cursor: pointer;"
                  :class="{ active: teleportInfo.destination.length === 16 }"
                  @[eventName].passive="onDeparture"
                >
                  <button>
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>

        <template v-else-if="operationMode === 'DISPLAY'">
          <div id="sm-controls-tab-content-region">
            <div class="sm-galaxy-display-tab">
              <div class="sm-affiliations">
                <label>Factions</label>
                <ul>
                  <li>
                    <input
                      id="affiliation-uee"
                      v-model="treeState.display.factions[0]"
                      name="affiliations"
                      type="checkbox"
                      value="1"
                      @change="playSound"
                    >
                    <label for="affiliation-uee" style="color: #48bbd4;">
                      <span style="left: 43px;"> UEE</span>
                    </label>
                  </li>
                  <li>
                    <input
                      id="affiliation-banu"
                      v-model="treeState.display.factions[1]"
                      name="affiliations"
                      type="checkbox"
                      value="2"
                      @change="playSound"
                    >
                    <label for="affiliation-banu" style="color: #ffce17;">
                      <span style="left: 3px;"> Banu</span>
                    </label>
                  </li>
                  <li>
                    <input
                      id="affiliation-vncl"
                      v-model="treeState.display.factions[2]"
                      name="affiliations"
                      type="checkbox"
                      value="3"
                      @change="playSound"
                    >
                    <label for="affiliation-vncl" style="color: #bd002d;">
                      <span style="left: -37px;"> Vanduul</span>
                    </label>
                  </li>
                  <li>
                    <input
                      id="affiliation-xian"
                      v-model="treeState.display.factions[3]"
                      name="affiliations"
                      type="checkbox"
                      value="4"
                      @change="playSound"
                    >
                    <label for="affiliation-xian" style="color: #52c231;">
                      <span style="left: -77px;"> Xi'An</span>
                    </label>
                  </li>
                  <li>
                    <input
                      id="affiliation-dev"
                      v-model="treeState.display.factions[4]"
                      name="affiliations"
                      type="checkbox"
                      value="7"
                      @change="playSound"
                    >
                    <label for="affiliation-dev" style="color: #ca922d;">
                      <span style="left: -117px;"> Developing</span>
                    </label>
                  </li>
                  <li>
                    <input
                      id="affiliation-unc"
                      v-model="treeState.display.factions[5]"
                      name="affiliations"
                      type="checkbox"
                      value="8"
                      @change="playSound"
                    >
                    <label for="affiliation-unc" style="color: #f6851f;">
                      <span style="left: -157px;"> Unclaimed</span>
                    </label>
                  </li>
                </ul>
              </div>

              <div class="sm-route-sizes">
                <label>Jump tunnels</label>
                <ul>
                  <li>
                    <input
                      id="route-size-small"
                      v-model="treeState.display.jumpTunnels[0]"
                      name="route_sizes"
                      type="checkbox"
                      value="small"
                      @change="playSound"
                    >
                    <label for="route-size-small">
                      <span style="left: 74px;"> small</span>
                    </label>
                  </li>
                  <li>
                    <input
                      id="route-size-medium"
                      v-model="treeState.display.jumpTunnels[1]"
                      name="route_sizes"
                      type="checkbox"
                      value="medium"
                      @change="playSound"
                    >
                    <label for="route-size-medium">
                      <span style="left: 34px;"> medium</span>
                    </label>
                  </li>
                  <li>
                    <input
                      id="route-size-large"
                      v-model="treeState.display.jumpTunnels[2]"
                      name="route_sizes"
                      type="checkbox"
                      value="large"
                      @change="playSound"
                    >
                    <label for="route-size-large">
                      <span style="left: -6px;"> large</span>
                    </label>
                  </li>
                </ul>
              </div>

              <div class="sm-scanners">
                <label>Sensors</label>
                <ul>
                  <li>
                    <input
                      id="sensor-lifeforms"
                      v-model="treeState.display.sensors"
                      name="scanners"
                      type="radio"
                      value="lifeforms"
                      @change="playSound"
                    >
                    <label for="sensor-lifeforms">
                      <span style="left: 40px;"> Population</span>
                    </label>
                  </li>
                  <li>
                    <input
                      id="sensor-economy"
                      v-model="treeState.display.sensors"
                      name="scanners"
                      type="radio"
                      value="economy"
                      @change="playSound"
                    >
                    <label for="sensor-economy">
                      <span style="left: 0px;"> Economy</span>
                    </label>
                  </li>
                  <li>
                    <input
                      id="sensor-crime"
                      v-model="treeState.display.sensors"
                      name="scanners"
                      type="radio"
                      value="crime"
                      @change="playSound"
                    >
                    <label for="sensor-crime">
                      <span style="left: -40px;"> Threat</span>
                    </label>
                  </li>
                </ul>
              </div>
              <div />
            </div>
          </div>
        </template>

        <div id="back-forward-container">
          <a
            v-if="treeHistory.isExistsPrev.value"
            id="back-to-the-prev"
            @click.prevent
            @[eventName].prevent="treeHistory.backToThePrev"
          >
            Back to the prev
          </a>
          <a
            v-if="treeHistory.isExistsNext.value"
            id="forward-to-the-next"
            @click.prevent
            @[eventName].prevent="treeHistory.forwardToTheNext"
          >
            forward to the next
          </a>
        </div>
      </section>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}

span,
label,
a {
  @include unSelectable;
}

ul,ol {
  margin: 0;
  padding: 0;
  list-style: none;
}

a {
  color: inherit;
  text-decoration: none;
}

input {
  outline: none;
}

button {
  background: transparent;
  padding: 0;
  margin: 0;
  border: 0;
  color: #000;
  border-radius: 0;
  color: #fff;
  font-family: 'Electrolize',sans-serif;
  text-transform: uppercase;
  cursor: pointer;
  line-height: 1;
  outline: none;
}

// GENERAL

#sm-controls-region {
  position: fixed;
  top: auto;
  left: 0;
  // right: calc(100% - 920px);
  right: 0;
  bottom: 0;
  width: 100%;
  background: #000;
  font-family: 'Electrolize',sans-serif;
  font-size: 1.8rem;
  color: #fff;
  line-height: 1;
  z-index: 10;

  #sm-controls-tabs-region {
    position: fixed;
    height: 41px;
    top: auto;
    left: 0;
    right: 0;
    bottom: 111px;
    background: transparent;

    .sm-tabs {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-wrap: nowrap;
      flex-wrap: nowrap;
      // position: fixed;
      // top: -41px;
      // left: 0;
      // right: 0;
      // bottom: auto;
      z-index: 2;
      pointer-events: none;
      width: 100%;
      // @include overflowScrollingX;

      &::before {
        content: '';
        display: block;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        background: transparent;
        border-bottom: 1px solid #0c67a1;
        background-image: none;
      }

      li {
        display: inline-block;
        vertical-align: top;
        text-align: left;
        background-color: rgba(0,0,0,0.95);
        border-top: 1px solid #0c67a1;
        position: relative;
        pointer-events: auto;
        margin-top: 4px;
        cursor: pointer;

        &::before {
          content: '';
          position: absolute;
          top: auto;
          left: -40px;
          bottom: 1px;
          right: auto;
          z-index: 2;
          width: 6px;
          height: 36px;
          -webkit-transform: skewX(-45deg);
          transform: skewX(-45deg);
          -webkit-transform-origin: bottom left;
          transform-origin: bottom left;
          background-color: #0c67a1;
        }

        &::after {
          content: '';
          position: absolute;
          top: auto;
          left: -36px;
          bottom: 0;
          right: 36px;
          border-bottom: 1px solid #0c67a1;
        }

        a {
          display: block;
          height: 36px;
          padding: 12px 15px 15px;
          font-family: 'Orbitron',sans-serif;
          font-size: 0.8rem;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #248bcf;
          padding-right: 51px;

          span {
            @include unSelectable;
          }

          &::before,
          &::after {
            content: '';
            position: absolute;
            top: auto;
            left: -36px;
            bottom: 0;
            right: auto;
          }

          &::before {
            content: '';
            position: absolute;
            top: auto;
            left: -35px;
            bottom: 0;
            right: auto;

            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 36px 36px 0;
            border-color: transparent rgba(0,0,0,0.95) transparent transparent;
            -webkit-transform: scaleY(-1);
            transform: scaleY(-1);
          }

          &::after {
            content: '';
            position: absolute;
            top: auto;
            left: -36px;
            bottom: 0;
            right: auto;

            width: 36px;
            height: 36px;
            background: url("@/assets/images/texture-corner.png") no-repeat;
            opacity: 0;
            @include unSelectable;
          }
        }

        &.sm-active {
          z-index: 3;
          background-image: url("@/assets/images/texture.png");
          background-position: 300px 10px;
          margin-top: 0;
          cursor: default;

          &::before {
            content: '';
            position: absolute;
            top: auto;
            // left: -36px;
            right: auto;
            bottom: 0;

            height: 40px;
            background-color: #42edf8;
            box-shadow:
              4px 4px 10px rgb(0 112 202 / 60%),
              -4px -4px 10px rgb(0 112 202 / 60%),
              -4px 4px 10px rgb(0 112 202 / 60%),
              4px -4px 10px rgb(0 112 202 / 60%);
          }

          a {
            height: 40px;
            padding-right: 15px;

            &::before {
              width: 0;
              height: 0;
              border-style: solid;
              border-width: 0 36px 36px 0;
              border-color: transparent rgba(0,0,0,0.95) transparent transparent;
              -webkit-transform: scaleY(-1);
              transform: scaleY(-1);
            }

            &::after {
              content: '';
              position: absolute;
              top: auto;
              left: -34px;
              bottom: 0;
              right: auto;

              width: 36px;
              height: 36px;
              background: url("@/assets/images/texture-corner.png") no-repeat;
              opacity: 1;
            }

            span {
              font-weight: bold;
              font-size: 1.2rem;
              color: #fee5a1;
              text-shadow:
                4px 4px 10px rgb(255 54 0 / 35%),
                -4px -4px 10px rgb(255 54 0 / 35%),
                -4px 4px 10px rgb(255 54 0 / 35%),
                4px -4px 10px rgb(255 54 0 / 35%);
              opacity: .8;
            }
          }

          &::after {
            right: 0;
            left: auto;
            width: 1px;
            height: 40px;
            background-color: #0c67a1;
          }

          &:last-child::after {
            opacity: 0;
          }
        }
      }
    }
  }

  .sm-controls {
    background-color: #000;
    // background-image: url("@/assets/images/texture.png");
    // background-position: 1px -1px;
    border-bottom: 1px solid #0c67a1;
    color: $blueLikeColor8;
    position: absolute;
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    overflow-y: visible;
    @include overflowScrollingX;

    // &::before {
    //   content: '';
    //   position: absolute;
    //   top: -145px;
    //   left: auto;
    //   bottom: auto;
    //   right: 10px;
    //   width: 70px;
    //   height: 80px;
    //   background: url("@/assets/images/logo.svg") no-repeat;
    //   background-position: 1px -41px;
    //   background-size: 100% 100%;
    //   background-position: center center;
    //   opacity: .45;
    //   pointer-events: none;
    // }

    // &::after {
    //   content: '';
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   right: auto;
    //   bottom: auto;
    //   width: 142px;
    //   height: 76px;
    //   background: url("@/assets/images/bg-logo.png") no-repeat;
    // }

    #sm-controls-tab-content-region {

      // &::before {
      //   content: '';
      //   position: absolute;
      //   top: -18px;
      //   left: 30px;
      //   bottom: auto;
      //   right: auto;
      //   z-index: 2;
      //   width: 174px;
      //   width: 110px;
      //   height: 92px;
      //   height: 107px;
      //   background: url("@/assets/images/ark-logo-horizontal.svg") no-repeat;
      //   // background: url("@/assets/images/Matrix-logo.svg") no-repeat;
      //   // background: url("@/assets/images/ClipartKey_1068795.png") no-repeat;
      //   box-shadow: 3px 0 white 10px 10px;
      //   background-size: 100% 100%;
      //   background-position: center center;
      // }

      &::after {
        content: '';
        position: absolute;
        top: auto;
        left: 0;
        right: var(--maxRight);
        bottom: 50px;
        border-bottom: 1px solid #00304e;
      }

      .sm-search-tab,
      .sm-teleport-tab,
      .sm-galaxy-display-tab {
        display: block;
        height: 110px;
        padding-bottom: 0px;
        // border: 1px solid #00304e;
        // background-color: rgba(1,10,21,0.35);
        background-color: #000;
        position: relative;
        padding-left: 20px;
        padding-right: 20px;
        text-align: right;
        white-space: nowrap;

        &:before {
          content: '';
          position: absolute;
          top: auto;
          left: 0;
          right: var(--maxRight);
          bottom: 55px;
          border-bottom: 1px solid #00304e;
        }

        &:after {
          content: '';
          position: absolute;
          top: auto;
          left: 0;
          right: var(--maxRight);
          bottom: 26px;
          border-bottom: 1px solid #00304e;
        }

        > div.sm-types,
        > div.sm-affiliations,
        > div.sm-route-sizes,
        > div.sm-scanners {
          position: relative;
          display: inline-block;
          vertical-align: top;
          white-space: normal;
          text-align: left;
          margin-left: 64px;
          height: 60px;

          > label {
            position: absolute;
            top: auto;
            left: auto;
            bottom: -18px;
            right: auto;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          ul {
            display: flex;
            flex-wrap: nowrap;
          }

          li {
            display: inline-block;
            vertical-align: top;
            // margin-left: 1px;

            &:last-child input+label {
              border-right: 1px solid #00304e;
            }

            input {
              display: none;
            }

            input+label {
              border-left: 1px solid #00304e;

              &::before {
                display: block;
                font-family: 'starmap-icons';
                font-style: normal;
                font-weight: normal;
                font-variant: normal;
                text-transform: none;
                line-height: 1;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }

              &::after {
                content: '';
                position: absolute;
                top: auto;
                left: 0;
                bottom: 1px;
                right: 0;
                height: 4px;
                background-color: #00304e;
                -webkit-transition: background-color 150ms ease-out;
                transition: background-color 150ms ease-out;
              }

              &:hover > span {
                opacity: 1;
              }

              span {
                position: absolute;
                top: auto;
                left: auto;
                bottom: -17px;
                bottom: 0;
                bottom: 12px;
                bottom: -18px;
                right: auto;
                color: #14e6fa;
                text-shadow:
                  4px 4px 10px rgb(0 90 255 / 33%),
                  -4px -4px 10px rgb(0 90 255 / 33%),
                  -4px 4px 10px rgb(0 90 255 / 33%),
                  4px -4px 10px rgb(0 90 255 / 33%);
                opacity: 0;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
                white-space: nowrap;
                transition: opacity .1s ease-out;

                &::before {
                  content: '/';
                  margin-right: 0.3em;
                }
              }
            }

            input:checked+label {
              background-color: rgba(27,75,140,0.35);
              color: #43edf8;

              &::after {
                background-color: #43edf8;
                box-shadow:
                  4px 4px 10px rgb(0 112 202 / 60%),
                  -4px -4px 10px rgb(0 112 202 / 60%),
                  -4px 4px 10px rgb(0 112 202 / 60%),
                  4px -4px 10px rgb(0 112 202 / 60%);
              }
            }

            input+label[for="route-size-small"]::before,
            input+label[for="route-size-small"]::before {
              content: '\e605';
              font-size: 5px;
            }
          }

          li:nth-child(1) {
            input+label span {
              left: 45px;
            }
          }
        }
      }
    }

    #back-forward-container {
      position: fixed;
      top: auto;
      left: 0;
      right: 0;
      bottom: 0;

      #back-to-the-prev {
        position: absolute;
        top: auto;
        left: 0;
        right: auto;
        bottom: 0;
        padding: 0 24px;
        height: 26px;
        line-height: 26px;
        font-size: 10px;
        color: #14ccfa;
        cursor: pointer;
        text-transform: uppercase;

        &::before {
          content: '<';
          margin-right: 8px;
        }
      }

      #forward-to-the-next {
        position: absolute;
        top: auto;
        left: auto;
        right: 0;
        bottom: 0;
        padding: 0 24px;
        height: 26px;
        line-height: 26px;
        font-size: 10px;
        color: #14ccfa;
        cursor: pointer;
        text-transform: uppercase;

        &::after {
          content: '>';
          margin-left: 8px;
        }
      }
    }
  }
}

// SEARCH

#sm-controls-region {

  .sm-search-tab {
    display: flex;
    flex-wrap: nowrap;

    & > div {
      position: relative;
      display: inline-block;
      vertical-align: top;
      white-space: normal;
      text-align: left;
      margin-left: 64px;

      & > label {
        position: absolute;
        top: auto;
        left: auto;
        right: auto;
        bottom: 0px;
        bottom: 8px;
        bottom: -18px;
        font-size: 10px;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
    }

    .sm-types {
      height: 60px;

      ul {
        display: flex;
        flex-wrap: nowrap;
      }

      li {
        display: inline-block;
        vertical-align: top;
        margin-left: 1px;

        &:nth-child(1) input+label span {
          left: 33px;
        }
        &:nth-child(2) input+label span {
          left: -38px;
        }

        &:last-child input+label {
          border-right: 1px solid #00304e;
        }
      }

      input {
        display: none;
      }

      input+label {
        display: block;
        width: 70px;
        padding-top: 20px;
        padding-right: 17.5px;
        text-align: center;
        cursor: pointer;
        position: relative;
        height: 60px;
        -webkit-transform: skewX(45deg);
        transform: skewX(45deg);
        -webkit-transform-origin: bottom right;
        transform-origin: bottom right;
        background-color: rgba(0,38,87,0.35);
        -webkit-transition: background-color 150ms ease-out,color 150ms ease-out;
        transition: background-color 150ms ease-out,color 150ms ease-out;
        -webkit-transition: background 150ms ease-out;
        transition: background 150ms ease-out;
        border-left: 1px solid #00304e;

        &::before {
          display: block;
          font-family: 'starmap-icons';
          font-style: normal;
          font-weight: normal;
          font-variant: normal;
          text-transform: none;
          line-height: 1;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        &::after {
          content: '';
          position: absolute;
          top: auto;
          left: 0;
          right: 0;
          bottom: 1px;
          height: 4px;
          background-color: #00304e;
          -webkit-transition: background-color 150ms ease-out;
          transition: background-color 150ms ease-out;
        }

        span {
          position: absolute;
          top: auto;
          left: auto;
          bottom: -18px;
          right: auto;
          color: #14e6fa;
          text-shadow: 4px 4px 10px rgb(0 90 255 / 33%), -4px -4px 10px rgb(0 90 255 / 33%), -4px 4px 10px rgb(0 90 255 / 33%), 4px -4px 10px rgb(0 90 255 / 33%);
          opacity: 0;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          white-space: nowrap;

          &::before {
            content: '/';
            margin-right: 0.3em;
          }
        }
      }

      input+label span,
      input+label::before {
        -webkit-transform: skewX(-45deg);
        transform: skewX(-45deg);
        -webkit-transform-origin: bottom right;
        transform-origin: bottom right;
      }

      input:checked+label {
        background-color: rgba(27,75,140,0.35);
        color: #43edf8;

        &::after {
          background-color: #43edf8;
          box-shadow:
            4px 4px 10px rgb(0 112 202 / 60%),
            -4px -4px 10px rgb(0 112 202 / 60%),
            -4px 4px 10px rgb(0 112 202 / 60%),
            4px -4px 10px rgb(0 112 202 / 60%);
        }
      }

      input+label[for='type-bs'] {
        padding-right: 3px;

        &::before {
          content: '\e60e';
          font-size: 11px;
        }
      }

      input+label[for='type-bo'] {
        padding-top: 17px;

        &::before {
          content: '\e60f';
          font-size: 17px;
        }
      }
    }

    .sm-search {
      // border-top: 1px solid #00304e;
      border-left: 1px solid #00304e;
      border-right: 1px solid #00304e;

      // .sm-field {
        display: inline-block;
        vertical-align: top;
        position: relative;
        height: 60px;
        -webkit-transform: skewX(45deg);
        transform: skewX(45deg);
        -webkit-transform-origin: bottom right;
        transform-origin: bottom right;
        background-color: rgba(0,38,87,0.35);
        -webkit-transition: background-color 150ms ease-out,color 150ms ease-out;
        transition: background-color 150ms ease-out,color 150ms ease-out;
        text-align: left;
        padding: 17px 32px;

        &::after {
          content: '';
          position: absolute;
          top: auto;
          left: 0;
          bottom: 1px;
          right: 0;
          height: 4px;
          background-color: #00304e;
          -webkit-transition: background-color 150ms ease-out;
          transition: background-color 150ms ease-out;
        }

        &.active::after {
          background: #43edf8;
          box-shadow: 4px 4px 10px rgb(0 112 202 / 60%), -4px -4px 10px rgb(0 112 202 / 60%), -4px 4px 10px rgb(0 112 202 / 60%), 4px -4px 10px rgb(0 112 202 / 60%);
        }

        label, input, button {
          -webkit-transform: skewX(-45deg);
          transform: skewX(-45deg);
          -webkit-transform-origin: bottom right;
          transform-origin: bottom right;
          display: block;
        }

        label {
          position: absolute;
          top: auto;
          left: auto;
          right: auto;
          bottom: 0px;
          bottom: 12px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          bottom: -18px;
          left: -12px;
        }

        input {
          padding: 0;
          margin: 0;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          border: 0;
          border-radius: 0;
          background: transparent;
          color: #fff;
          font-family: 'Electrolize',sans-serif;
          font-size: 11px;
          text-transform: uppercase;
          color: #14ccfa;
          width: 240px;
          padding-top: 4px;
          padding-bottom: 3px;
        }

        .sm-search-autocomplete {
          display: inline-block;
          vertical-align: top;
          // color: #00304e;
          color: #14ccfa;
          width: 44px;
          min-width: 60px;
          min-height: 26px;
          margin-top: -1px;
          margin-left: -44px;
          margin-right: -20px;
          padding-top: 1px;
          padding-right: 32px;

          &::before {
            content: '\e600';
            display: block;
            font-family: 'starmap-icons';
            font-style: normal;
            font-weight: normal;
            font-variant: normal;
            text-transform: none;
            line-height: 1;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-size: 15px;
            -webkit-transform: scaleX(-1);
            transform: scaleX(-1);
          }

          span {
            display: none;
          }
        }

        .sm-input-container {
          display: inline-block;
          vertical-align: top;
          background-color: rgba(0,38,87,0.7);
        }
      }
    // }
  }
}

// TELEPORT

#sm-controls-region {

  .sm-controls {

    #sm-controls-tab-content-region {

      .sm-teleport-tab {

        .sm-teleport {
          margin-left: 64px;

          & > div {
            display: inline-block;
            vertical-align: top;
            white-space: normal;
            text-align: left;
            margin-left: 64px;

            &:first-child {
              margin-left: 0;
            }

            &.sm-destination-region {
              margin-left: -1px;
            }

            & > label {
              position: absolute;
              top: auto;
              left: auto;
              bottom: 0px;
              bottom: 12px;
              right: auto;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
          }

          .sm-actions:not(.active) {
            color: #0a5688;
          }
          .sm-actions.active {
            color: #43edf8;

            &::after {
              background: #43edf8;
              box-shadow: 4px 4px 10px rgb(0 112 202 / 60%), -4px -4px 10px rgb(0 112 202 / 60%), -4px 4px 10px rgb(0 112 202 / 60%), 4px -4px 10px rgb(0 112 202 / 60%);
            }
          }

          .sm-field,
          .sm-actions {
            display: inline-block;
            vertical-align: top;
            position: relative;
            height: 60px;
            // border-top: 1px solid #00304e;
            border-left: 1px solid #00304e;
            border-right: 1px solid #00304e;
            -webkit-transform: skewX(45deg);
            transform: skewX(45deg);
            -webkit-transform-origin: bottom right;
            transform-origin: bottom right;
            background-color: rgba(0,38,87,0.35);
            -webkit-transition: background-color 150ms ease-out,color 150ms ease-out;
            transition: background-color 150ms ease-out,color 150ms ease-out;
            text-align: left;
            padding: 17px 32px;

            &::after {
              content: '';
              position: absolute;
              top: auto;
              left: 0;
              bottom: 1px;
              right: 0;
              height: 4px;
              background-color: #00304e;
              -webkit-transition: background-color 150ms ease-out;
              transition: background-color 150ms ease-out;
            }

            &.active::after {
              background: #43edf8;
              box-shadow: 4px 4px 10px rgb(0 112 202 / 60%), -4px -4px 10px rgb(0 112 202 / 60%), -4px 4px 10px rgb(0 112 202 / 60%), 4px -4px 10px rgb(0 112 202 / 60%);
            }

            button {
              font-family: 'Orbitron',sans-serif;
              font-size: 11px;
              letter-spacing: 1px;
              color: inherit;
              padding-top: 7px;
            }
          }

          .sm-field label,
          .sm-actions label,
          .sm-field input,
          .sm-actions input,
          .sm-field button,
          .sm-actions button {
            -webkit-transform: skewX(-45deg);
            transform: skewX(-45deg);
            -webkit-transform-origin: bottom right;
            transform-origin: bottom right;
            display: block;
          }

          .sm-field .sm-input-container,
          .sm-actions .sm-input-container {
            display: inline-block;
            vertical-align: top;
            background-color: rgba(0,38,87,0.7);
          }

          .sm-field input,
          .sm-actions input {
            padding: 0;
            margin: 0;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            border: 0;
            border-radius: 0;
            background: transparent;
            color: #fff;
            font-family: 'Electrolize',sans-serif;
            font-size: 11px;
            text-transform: uppercase;
            color: #14ccfa;
            width: 128px;
            padding-top: 4px;
            padding-bottom: 3px;
            position: relative;
            left: -6px;
          }

          .sm-departure-region .sm-input-container,
          .sm-destination-region .sm-input-container {
            padding-left: 8px;
            padding-right: 8px;
          }

          .sm-field::after,
          .sm-actions::after {
            content: '';
            position: absolute;
            top: auto;
            left: 0;
            bottom: 1px;
            right: 0;
            height: 4px;
            background-color: #00304e;
            -webkit-transition: background-color 150ms ease-out;
            transition: background-color 150ms ease-out;
          }

          .sm-field .sm-input-container,
          .sm-actions .sm-input-container {
            display: inline-block;
            vertical-align: top;
            background-color: rgba(0,38,87,0.7);
          }

          .sm-field label,
          .sm-actions label {
            position: absolute;
            top: auto;
            left: auto;
            bottom: 0px;
            bottom: 12px;
            bottom: -18px;
            right: auto;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            left: -8px;
          }

          .sm-results-region {
            position: absolute;
            top: 37px;
            left: 17px;
            bottom: auto;
            right: auto;
            z-index: 3;
            width: 210px;
            background-color: #001735;
            opacity: 0;
            visibility: hidden;
            -webkit-transition: visibility 0s linear,opacity 150ms ease-out;
            transition: visibility 0s linear,opacity 150ms ease-out;
            -webkit-transition-delay: 150ms,0s;
            transition-delay: 150ms,0s;
          }

          // .sm-ship-size li {
          //   display: inline-block;
          //   vertical-align: top;
          //   margin-left: 1px;

          //   &:nth-child(1) inpt+label span { left: 45px; }
          //   &:nth-child(2) inpt+label span { left: 4px; }
          //   &:nth-child(3) inpt+label span { left: -37px; }
          // }

          // .sm-ship-size input+label {
          //   display: block;
          //   width: 40px;
          //   padding-top: 20px;
          //   padding-right: 10px;
          //   text-align: center;
          //   cursor: pointer;
          //   position: relative;
          //   height: 60px;
          //   -webkit-transform: skewX(45deg);
          //   transform: skewX(45deg);
          //   -webkit-transform-origin: bottom right;
          //   transform-origin: bottom right;
          //   background-color: rgba(0,38,87,0.35);
          //   -webkit-transition: background-color 150ms ease-out,color 150ms ease-out;
          //   transition: background-color 150ms ease-out,color 150ms ease-out;
          //   -webkit-transition: background 150ms ease-out;
          //   transition: background 150ms ease-out;
          // }

          // .sm-ship-size input {
          //   display: none;
          // }

          // .sm-ship-size input:checked+label {
          //   background-color: rgba(27,75,140,0.35);
          //   color: #43edf8;
          // }

          // .sm-ship-size input+label::before {
          //   display: block;
          //   font-family: 'starmap-icons';
          //   font-style: normal;
          //   font-weight: normal;
          //   font-variant: normal;
          //   text-transform: none;
          //   line-height: 1;
          //   -webkit-font-smoothing: antialiased;
          //   -moz-osx-font-smoothing: grayscale;
          // }

          // .sm-ship-size input+label::before {
          //   content: '';
          //   display: inline-block;
          //   vertical-align: top;
          //   border-radius: 50%;
          //   width: 5px;
          //   height: 5px;
          //   border: 1px solid;
          // }

          // .sm-ship-size input+label::after {
          //   content: '';
          //   position: absolute;
          //   top: auto;
          //   left: 0;
          //   right: 0;
          //   bottom: 1px;
          //   height: 4px;
          //   background-color: #00304e;
          //   -webkit-transition: background-color 150ms ease-out;
          //   transition: background-color 150ms ease-out;
          // }

          // .sm-ship-size input:checked+label::after {
          //   background-color: #43edf8;
          //   box-shadow:
          //     4px 4px 10px rgb(0 112 202 / 60%),
          //     -4px -4px 10px rgb(0 112 202 / 60%),
          //     -4px 4px 10px rgb(0 112 202 / 60%),
          //     4px -4px 10px rgb(0 112 202 / 60%);
          // }

          // .sm-ship-size input+label[for='size-S'] {
          //   padding-top: 25px;
          // }

          // .sm-ship-size input+label[for='size-M'] {
          //   padding-top: 23px;
          // }

          // .sm-ship-size input+label[for='size-L']::before {
          //   width: 10px;
          //   height: 10px;
          // }

          // .sm-ship-size input+label span::before {
          //   content: '/';
          //   margin-right: 0.3em;
          // }

          // .sm-ship-size input+label span {
          //   position: absolute;
          //   top: auto;
          //   left: auto;
          //   bottom: -17px;
          //   bottom: 0;
          //   bottom: 12px;
          //   right: auto;
          //   color: #14e6fa;
          //   text-shadow: 4px 4px 10px rgb(0 90 255 / 33%), -4px -4px 10px rgb(0 90 255 / 33%), -4px 4px 10px rgb(0 90 255 / 33%), 4px -4px 10px rgb(0 90 255 / 33%);
          //   opacity: 0;
          //   font-size: 10px;
          //   text-transform: uppercase;
          //   letter-spacing: 1px;
          //   white-space: nowrap;
          // }

          // .sm-ship-size input+label span,
          // .sm-ship-size input+label::before {
          //   -webkit-transform: skewX(-45deg);
          //   transform: skewX(-45deg);
          //   -webkit-transform-origin: bottom right;
          //   transform-origin: bottom right;
          // }

          .sm-actions button::after {
            content: '\e610';
            font-family: 'starmap-icons';
            font-style: normal;
            font-weight: normal;
            font-variant: normal;
            text-transform: none;
            line-height: 1;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            margin-left: 12px;
          }
        }
      }
    }
  }
}

// DISPLAY

#sm-controls-region {

  .sm-controls {

  // FIXME
  .sm-galaxy-display-tab .sm-affiliations input+label,
  .sm-system-display-tab .sm-affiliations input+label {
    display: block;
    width: 40px;
    padding-top: 20px;
    padding-right: 10px;
    text-align: center;
    cursor: pointer;
    position: relative;
    height: 60px;
    -webkit-transform: skewX(45deg);
    transform: skewX(45deg);
    -webkit-transform-origin: bottom right;
    transform-origin: bottom right;
    background-color: rgba(0,38,87,0.35);
    -webkit-transition: background-color 150ms ease-out,color 150ms ease-out;
    transition: background-color 150ms ease-out,color 150ms ease-out;
    -webkit-transition: background 150ms ease-out;
    transition: background 150ms ease-out;
  }

  .sm-galaxy-display-tab .sm-affiliations li,
  .sm-system-display-tab .sm-affiliations li {
    display: inline-block;
    vertical-align: top;
    // margin-left: 1px;
  }

  .sm-galaxy-display-tab .sm-affiliations input+label span::before,
  .sm-system-display-tab .sm-affiliations input+label span::before {
    content: '/';
    margin-right: 0.3em;
  }

  .sm-galaxy-display-tab input+label[for="affiliation-uee"]::before,
  .sm-system-display-tab input+label[for="affiliation-uee"]::before {
    content: '\e609';
    font-size: 13px;
  }

  .sm-galaxy-display-tab input+label[for="affiliation-banu"]::before,
  .sm-system-display-tab input+label[for="affiliation-banu"]::before {
    content: '\e606';
    font-size: 11px;
  }

  .sm-galaxy-display-tab input+label[for="affiliation-vncl"]::before,
  .sm-system-display-tab input+label[for="affiliation-vncl"]::before {
    content: '\e60b';
    font-size: 13px;
  }

  .sm-galaxy-display-tab input+label[for="affiliation-xian"]::before,
  .sm-system-display-tab input+label[for="affiliation-xian"]::before {
    content: '\e60d';
    font-size: 14px;
  }

  .sm-galaxy-display-tab input+label[for="affiliation-dev"]::before,
  .sm-system-display-tab input+label[for="affiliation-dev"]::before {
    content: '\e607';
    font-size: 12px;
  }

  .sm-galaxy-display-tab input+label[for="affiliation-unc"]::before,
  .sm-system-display-tab input+label[for="affiliation-unc"]::before {
    content: '\e60a';
    font-size: 12px;
  }

  .sm-galaxy-display-tab input+label[for="route-size-small"]::before,
  .sm-system-display-tab input+label[for="route-size-small"]::before {
    content: '\e605';
    font-size: 5px;
  }

  .sm-galaxy-display-tab .sm-affiliations input+label span::before,
  .sm-system-display-tab .sm-affiliations input+label span::before {
    content: '/';
    margin-right: 0.3em;
  }

  .sm-galaxy-display-tab input+label[for="route-size-medium"]::before,
  .sm-system-display-tab input+label[for="route-size-medium"]::before {
    content: '\e604';
    font-size: 10px;
  }

  .sm-galaxy-display-tab input+label[for="route-size-large"]::before,
  .sm-system-display-tab input+label[for="route-size-large"]::before {
    content: '\e603';
    font-size: 14px;
  }

  .sm-galaxy-display-tab .sm-affiliations li:nth-child(2) input+label span,
  .sm-system-display-tab .sm-affiliations li:nth-child(2) input+label span {
    left: 4px;
  }

  .sm-galaxy-display-tab .sm-affiliations input+label span,
  .sm-system-display-tab .sm-affiliations input+label span {
    position: absolute;
    top: auto;
    left: auto;
    bottom: -17px;
    bottom: 0;
    bottom: 12px;
    right: auto;
    color: #14e6fa;
    text-shadow: 4px 4px 10px rgb(0 90 255 / 33%), -4px -4px 10px rgb(0 90 255 / 33%), -4px 4px 10px rgb(0 90 255 / 33%), 4px -4px 10px rgb(0 90 255 / 33%);
    opacity: 0;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    white-space: nowrap;
  }

  .sm-galaxy-display-tab .sm-affiliations input:checked+label::after,
  .sm-system-display-tab .sm-affiliations input:checked+label::after {
    background-color: #43edf8;
    box-shadow: 4px 4px 10px rgb(0 112 202 / 60%), -4px -4px 10px rgb(0 112 202 / 60%), -4px 4px 10px rgb(0 112 202 / 60%), 4px -4px 10px rgb(0 112 202 / 60%);
  }

  .sm-galaxy-display-tab .sm-route-sizes input+label::before,
  .sm-system-display-tab .sm-route-sizes input+label::before {
    display: block;
    font-family: 'starmap-icons';
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .sm-galaxy-display-tab .sm-route-sizes input+label,
  .sm-system-display-tab .sm-route-sizes input+label {
    display: block;
    width: 40px;
    padding-top: 20px;
    padding-right: 10px;
    text-align: center;
    cursor: pointer;
    position: relative;
    height: 60px;
    -webkit-transform: skewX(45deg);
    transform: skewX(45deg);
    -webkit-transform-origin: bottom right;
    transform-origin: bottom right;
    background-color: rgba(0,38,87,0.35);
    -webkit-transition: background-color 150ms ease-out,color 150ms ease-out;
    transition: background-color 150ms ease-out,color 150ms ease-out;
    -webkit-transition: background 150ms ease-out;
    transition: background 150ms ease-out;
  }

  .sm-galaxy-display-tab .sm-scanners input+label,
  .sm-system-display-tab .sm-scanners input+label {
    display: block;
    width: 40px;
    padding-top: 20px;
    padding-right: 10px;
    text-align: center;
    cursor: pointer;
    position: relative;
    height: 60px;
    -webkit-transform: skewX(45deg);
    transform: skewX(45deg);
    -webkit-transform-origin: bottom right;
    transform-origin: bottom right;
    background-color: rgba(0,38,87,0.35);
    -webkit-transition: background-color 150ms ease-out,color 150ms ease-out;
    transition: background-color 150ms ease-out,color 150ms ease-out;
    -webkit-transition: background 150ms ease-out;
    transition: background 150ms ease-out;
  }

  .sm-galaxy-display-tab input+label[for="sensor-lifeforms"]::before,
  .sm-system-display-tab input+label[for="sensor-lifeforms"]::before {
    content: '\e611';
    font-size: 22px;
  }

  .sm-galaxy-display-tab input+label[for="sensor-economy"]::before,
  .sm-system-display-tab input+label[for="sensor-economy"]::before {
    content: '\e602';
    font-size: 16px;
  }

  .sm-galaxy-display-tab input+label[for="sensor-crime"]::before,
  .sm-system-display-tab input+label[for="sensor-crime"]::before {
    content: '\e601';
    font-size: 16px;
  }

  .sm-galaxy-display-tab .sm-affiliations li:nth-child(1) input+label span,
  .sm-system-display-tab .sm-affiliations li:nth-child(1) input+label span {
    left: 45px;
  }

  .sm-galaxy-display-tab .sm-affiliations input:checked+label,
  .sm-system-display-tab .sm-affiliations input:checked+label {
    background-color: rgba(27,75,140,0.35);
    color: #43edf8;
  }

  .sm-galaxy-display-tab .sm-affiliations input+label,
  .sm-system-display-tab .sm-affiliations input+label {
    display: block;
    width: 40px;
    padding-top: 20px;
    padding-right: 10px;
    text-align: center;
    cursor: pointer;
    position: relative;
    height: 60px;
    -webkit-transform: skewX(45deg);
    transform: skewX(45deg);
    -webkit-transform-origin: bottom right;
    transform-origin: bottom right;
    background-color: rgba(0,38,87,0.35);
    -webkit-transition: background-color 150ms ease-out,color 150ms ease-out;
    transition: background-color 150ms ease-out,color 150ms ease-out;
    -webkit-transition: background 150ms ease-out;
    transition: background 150ms ease-out;
  }

  .sm-galaxy-display-tab .sm-affiliations input+label::before,
  .sm-system-display-tab .sm-affiliations input+label::before {
    display: block;
    font-family: 'starmap-icons';
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .sm-galaxy-display-tab .sm-affiliations input+label span,
  .sm-system-display-tab .sm-affiliations input+label span,
  .sm-galaxy-display-tab .sm-affiliations input+label::before,
  .sm-system-display-tab .sm-affiliations input+label::before {
    -webkit-transform: skewX(-45deg);
    transform: skewX(-45deg);
    -webkit-transform-origin: bottom right;
    transform-origin: bottom right;
  }

  .sm-galaxy-display-tab .sm-route-sizes input+label span,
  .sm-system-display-tab .sm-route-sizes input+label span,
  .sm-galaxy-display-tab .sm-route-sizes input+label::before,
  .sm-system-display-tab .sm-route-sizes input+label::before {
    -webkit-transform: skewX(-45deg);
    transform: skewX(-45deg);
    -webkit-transform-origin: bottom right;
    transform-origin: bottom right;
  }

  .sm-galaxy-display-tab .sm-scanners input+label span,
  .sm-system-display-tab .sm-scanners input+label span,
  .sm-galaxy-display-tab .sm-scanners input+label::before,
  .sm-system-display-tab .sm-scanners input+label::before {
    -webkit-transform: skewX(-45deg);
    transform: skewX(-45deg);
    -webkit-transform-origin: bottom right;
    transform-origin: bottom right;
  }

  .sm-galaxy-display-tab .sm-affiliations input+label span,
  .sm-system-display-tab .sm-affiliations input+label span,
  .sm-galaxy-display-tab .sm-affiliations input+label::before,
  .sm-system-display-tab .sm-affiliations input+label::before {
    -webkit-transform: skewX(-45deg);
    transform: skewX(-45deg);
    -webkit-transform-origin: bottom right;
    transform-origin: bottom right;
  }
  }
}
</style>
