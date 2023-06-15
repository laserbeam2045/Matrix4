<!-- <template>
  <transition :appear="true">
    <fieldset class="sample-items">
      <legend>Matrix</legend>
      <VueDraggableNext
        class="container"
        v-bind="dragItemOptions"
        :list="items"
        @add="onAdd"
      >
        <AppItem
          v-for="item in items"
          :key="item.id"
          class="app-item"
          :class="{ active: item.id === rootId }"
          :data-id="item.id"
          :tree-data="item"
          v-on="eventListeners.item"
        />
      </VueDraggableNext>
    </fieldset>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted, toRefs, PropType } from 'vue'

import AppItem from '@/components/AppItem.vue'
import { VueDraggableNext } from 'vue-draggable-next'

import Sortable from 'sortablejs'
import { SetId } from '@/types/Id'
import { DRAG_MODE, DragMode, CustomDragEvent } from '@/types/Draggable'
import useDraggable from '@/composables/useDraggableNext'

export default defineComponent({
  components: {
    AppItem,
    VueDraggableNext,
  },
  props: {
    rootId: {
      type: String,
      required: true,
    },
    dragMode: {
      type: String as PropType<DragMode>,
      required: true,
    },
  },
  emits: ['foo'],
  setup(props, { emit }) {

    const setIds = ref<SetId[]>([])
    const items = ref<any>([])

    // DnDに関する設定
    const { dragMode: propDragMode } = toRefs(props)

    // 親からプロパティを受け取らなかった場合はデフォルト値が設定される
    const dragMode = computed(() => propDragMode?.value ?? DRAG_MODE.LOCK)

    // ノード単位のDnDに関する設定
    const dragItemSettings = computed<Sortable.SortableOptions>(() => (
      dragMode.value === DRAG_MODE.NODE
        ? {
          group: {
            name: 'nodes',
            pull: true,
            put: true,
          },
          sort: true,
          direction: 'horizontal',
        }
        : { disabled: true }
    ))

    // VueDraggableNextに渡す設定
    const {
      draggableOptions: dragItemOptions,
    } = useDraggable(dragItemSettings)

    watch(setIds, async (ids) => {
      const result = await Promise.all(ids.map((foo) => setsRepository.value.selectNode({ id: foo.setId })))
      items.value = result
        .map((d) => d?.data[0])
        .filter(v => v)
    })

    const onAdd = (e: CustomDragEvent) => {
      const id = e.item.dataset.id
      if (id === '1') {
        updateData()
      } else {
        setIdsRepository.value.createId({ id })
          .catch(() => setIdsRepository.value.deleteId({ id }).then(updateData))
      }
    }

    const updateData = async () => {
      const result = await setIdsRepository.value.fetchIds()

      if (result?.status === 200) {
        setIds.value = result.data
      }
    }

    onMounted(() => {
      updateData()
    })

    const eventListeners = {
      item: {
        [`${MOUSE_TOUCH_EVEN.CLICK}Passive`](e: Event) {
          const target = e.target as HTMLElement
          if ('dataset' in target ?? {}) {
            emit('foo', target.dataset.id)
          }
          // e.stopPropagation()
        },
      },
    }

    return { items, dragItemOptions, onAdd, eventListeners }
  },
})
</script>

<style lang="scss" scoped>
* {
  @include unSelectable;
}

.sample-items {
  width: auto;
  height: 80px;
  display: block;
  box-sizing: border-box;
  margin: 8px 0 0;
  padding: 5px 10px 10px 15px;
  border: 1px solid #17d2cf;
  border-radius: 5px;

  legend {
    padding: 0 7px 0 5px;
    color: #17d2cf;
    font-family: $fontFamily4;
  }

  .container {
    display: flex;
    width: 100%;
    max-width: 85vw;
    min-height: 45px;
    margin-top: -8px;

    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      display: none;
    }

    > .app-item {
      margin: 8px 8px 0 0 !important;
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
  }
}

.v-enter-active,
.v-leave-active {
  transition: all .3s ease-out !important;
}

.v-leave-to,
.v-enter-from {
  opacity: 0;
  transform: scale(1.2);
}

.v-enter-from {
  transform: scale(1);
}

.v-enter-to,
.v-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style> -->
