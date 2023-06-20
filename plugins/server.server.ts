import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  useState('TREE_ROOT_ID', () => process.env.TREE_ROOT_ID)

  console.log('%cserver', 'color: red;')
})
