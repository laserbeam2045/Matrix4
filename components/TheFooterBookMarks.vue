<template>
  <teleport to="#layer-1">
    <transition
      name="fade"
      appear
    >
      <AppWindowVirtual
        v-if="isVisible"
        v-center="{ offset: 1.5 }"
        v-draggable
        v-bind="$attrs"
        class="window"
        legend="BookMarks"
        style="z-index: 100;"
        @touchmove.prevent
      >
        <template #buttons>
          <AppHeaderItem
            name="times"
            @touchend.stop="close(); $emit('close')"
            @mouseup.stop="close(); $emit('close')"
          />
        </template>
        <template #default>
          <div class="container">
            <table>
              <thead>
                <tr v-if="bookMarks.length !== 0">
                  <th>TITLE</th>
                  <th colspan="2">ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="bookMark in bookMarks"
                  :key="bookMark.id"
                >
                  <td>{{ bookMark.text }}</td>
                  <td>
                    <AppFontAwesome
                      icon-name="ban"
                      @touchend.stop="deleteBookMark(bookMark.id)"
                      @mouseup.stop="deleteBookMark(bookMark.id)"
                    />
                  </td>
                  <td>
                    <AppFontAwesome
                      icon-name="link"
                      @touchend.stop="changeRoot(bookMark.id)"
                      @mouseup.stop="changeRoot(bookMark.id)"
                    />
                  </td>
                </tr>
                <tr v-if="bookMarks.length === 0">
                  <td class="empty text-center py-2 px-8">
                    YOU HAVE NO BOOKMARKS YET
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

const { treeMethods } = defineProps<{
  isVisible: boolean
  treeMethods: TreeMethods
}>()

const emit = defineEmits<{
  (event: 'update:isVisible', value: boolean): void
  (event: 'close'): void
}>()

const { bookMarks, deleteBookMark } = useBookMark()

const close  = () => emit('update:isVisible', false)

const changeRoot = (id: string) => {
  treeMethods.changeRoot(id)
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 16px 16px;

  th {
    padding: 0.5rem 2rem 0.5rem;
    @include unSelectable;
  }

  td:first-child {
    min-width: 170px;
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
