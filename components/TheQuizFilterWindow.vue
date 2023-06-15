<script setup lang="ts">
import { Ref } from 'vue'

// const props = defineProps<{
//   filterConditions: {
//     failed: boolean
//   }
// }>()

// defineEmits<{
//   (event: 'touch'): void
// }>()

const filterConditions: Ref<{
  unplayed: boolean
  cleared: boolean
  failed: boolean
}> =  useState('filterConditions')

// const { mouseTouchEvent } = useEvent()

// const eventName = computed(() => mouseTouchEvent.value.START + 'Passive')
</script>

<template>
  <div>
    <fieldset class="sort mt-0">
      <div class="inner_container">
        <label>Unplayed<AppInputCheckbox v-model:checked="filterConditions.unplayed" /></label>
        <label>Cleared<AppInputCheckbox v-model:checked="filterConditions.cleared" /></label>
        <label>Failed<AppInputCheckbox v-model:checked="filterConditions.failed" /></label>
      </div>
    </fieldset>
  </div>
</template>

<style lang="scss" scoped>

.sort {
  width: 365px;
  padding: 64px 16px 16px;
  display: flex;
  justify-content: center;
  // border: 1px solid transparent;
  // background: rgba(0, 0, 0, 0.4);
  // border-radius: 5px;

  > .inner_container {
    display: flex;
    flex-direction: column;
    padding: 16px 0px;
    width: 99%;
    @include textStyleC;

    > label {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      height: 44px;
    }
  }
}
</style>
