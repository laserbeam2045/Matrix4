import { defineNuxtPlugin } from '#app'

// import attachFastClick from 'fastclick'

export default defineNuxtPlugin(() => {
  useState('client', () => 'client')
  useState('TREE_ROOT_ID', () => '9FGOQhg2IodypRvq')
  useState('clipboardData', () => '')
  useState('treeMode', () => 'DISPLAY')
  useState('applicationMode', () => null)

  useState('isSoundOn', () => false)

  const showNavigation = useState('showNavigation', () => false)
  const isCircleActive = useState('isCircleActive', () => false)

  const activateNavigation = () => {
    showNavigation.value = true
    setTimeout(() => isCircleActive.value = true, 100)
  }

  const deactivateNavigation = () => {
    isCircleActive.value = false
    setTimeout(() => {
      showNavigation.value = false
    }, 500)
  }

  const toggleNavigation = () => {
    isCircleActive.value ? deactivateNavigation() : activateNavigation()
  }

  // window.addEventListener('load', () => {
  //   attachFastClick(document.body)
  // })

  console.log('%cclient', 'color: red;')

  return {
    provide: {
      activateNavigation,
      deactivateNavigation,
      toggleNavigation,
    },
  }
})
