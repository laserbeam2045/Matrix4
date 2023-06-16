import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  useState('TREE_ROOT_ID', () => '9FGOQhg2IodypRvq')

  console.log('%cserver', 'color: red;')
})
