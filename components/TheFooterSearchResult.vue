<template>
  <teleport to="#layer-3">
    <transition
      name="fade"
      appear
    >
      <AppWindowVirtual
        v-if="isVisible"
        v-center="{ offset: 1.0, position: 'fixed' }"
        v-draggable="{ position: 'fixed' }"
        v-bind="$attrs"
        class="window"
        legend="Search Result"
        style="z-index: 100;"
      >
        <template #buttons>
          <AppHeaderItem
            name="times"
            @touchend.stop="close(); $emit('close')"
            @mouseup.stop="close(); $emit('close')"
          />
        </template>
        <template #default>
          <div class="container" @mousewheel.stop>
            <table>
              <thead>
                <tr v-if="searchResult.length !== 0">
                  <th>NAME</th>
                  <th colspan="2">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="bookMark in searchResult"
                  :key="bookMark.id"
                >
                  <td>
                    <span>{{ bookMark.txt }}</span>
                  </td>
                  <!-- <td>
                    <AppFontAwesome
                      icon-name="ban"
                      @touchend.stop="deleteBookMark(bookMark.id)"
                      @mouseup.stop="deleteBookMark(bookMark.id)"
                    />
                  </td> -->
                  <td>
                    <!-- <AppFontAwesome
                      icon-name="link"
                      @touchend.stop="changeRoot(bookMark.id)"
                      @mouseup.stop="changeRoot(bookMark.id)"
                    /> -->
                    <button
                      class="go"
                      @touchend.stop="changeRoot(bookMark.id)"
                      @mouseup.stop="changeRoot(bookMark.id)"
                    >
                      <span>Go</span>
                    </button>
                  </td>
                </tr>
                <tr v-if="searchResult.length === 0">
                  <td class="empty text-center py-2 px-8">
                    YOU HAVE NO SEARCH RESULT
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </template>
      </AppWindowVirtual>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import type { TreeMethods } from '@/composables/useTree'

import { SetResponse } from '@/composables/useTree'

const {
  treeMethods,
  searchResult,
} = defineProps<{
  isVisible: boolean
  searchResult: SetResponse[]
  treeMethods: TreeMethods
}>()

const emit = defineEmits<{
  'update:isVisible': [value: boolean]
  close: []
}>()

const close  = () => emit('update:isVisible', false)

const changeRoot = (id: string) => {
  treeMethods.changeRoot(id)
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 16px 0px;
  margin: 0 0 16px;
  max-height: 50vh;
  @include overflowScrollingY;

  table {
    border-collapse: separate;

    thead {

      tr {
        position: relative;
        border: 1px solid #0c67a1;

        th {
          position: sticky;
          top: 0px;
          left: 0px;
          z-index: 10;
          background: rgba(1,9,19,1);
          background-clip: padding-box;
          border: 1px solid #0c67a1;
          padding: 16px 16px;
          @include unSelectable;
        }
      }
    }

    tbody {
      overflow: hidden;

      tr {

        &:hover {

          td:not(.empty) {
            background: rgba(190,190,190,0.1);
            backdrop-filter: blur(3px);
            border: 1px solid #0c67a1;
          }
        }

        td {
          height: 25px;
          padding: 4px 0 0;
          white-space: nowrap;
          background-clip: padding-box;

          &:first-child {
            min-width: 170px;
          }

          &.empty {

            @include unSelectable;
          }

          &:not(.empty) {
            background: rgba(1,9,19,0.66);
            border: 1px solid #0c67a1;
          }

          > span {
            display: inline-block;
            margin: 2px 8px 0;
            max-width: 240px;
            @include overflowScrollingX;
          }

          .go {
            color: #ffb534;
            text-shadow: 4px 4px 10px rgb(255 0 0 / 35%), -4px -4px 10px rgb(255 0 0 / 35%), -4px 4px 10px rgb(255 0 0 / 35%), 4px -4px 10px rgb(255 0 0 / 35%);

            &::before {
              content: '\e610';
              font-family: 'starmap-icons';
              font-style: normal;
              font-weight: normal;
              font-variant: normal;
              text-transform: none;
              line-height: 1;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }

            span {
              display: none;
            }
          }
        }
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-from {
  transform: scale(1.2);
}
</style>
