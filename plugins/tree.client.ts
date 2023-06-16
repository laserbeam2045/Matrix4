import { defineNuxtPlugin } from '#app'

import type { TreeState } from '@/composables/useTree'

export default defineNuxtPlugin(() => {

  useState('treeState', () => ({
    search: {
      showWindow: true,
      filters: [
        true,
        true,
      ],
      word: '',
      result: [],
    },
    display: {
      factions: [
        true,
        true,
        true,
        true,
        true,
        true,
      ],
      jumpTunnels: [
        true,
        true,
        true,
      ],
      sensors: 'lifeforms',
    },
  } as TreeState))
})
