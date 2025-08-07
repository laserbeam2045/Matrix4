import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  useState('TREE_ROOT_ID', () => '9FGOQhg2IodypRvq')
  // useState('HOME_ROOT_ID', () => 'ozmkiRCEBnh7ZT83')
  useState('HOME_ROOT_ID', () => 'SiEBuCsBGkm/UUUe')

  console.log('%cserver', 'color: red;')
})
