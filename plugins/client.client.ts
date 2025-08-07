import { defineNuxtPlugin } from '#app'

// import attachFastClick from 'fastclick'

export default defineNuxtPlugin(() => {
  useState('client', () => 'client')
  useState('TREE_ROOT_ID', () => '9FGOQhg2IodypRvq')
  // useState('HOME_ROOT_ID', () => 'ozmkiRCEBnh7ZT83')
  useState('HOME_ROOT_ID', () => 'SiEBuCsBGkm/UUUe')
  useState('clipboardData', () => '')
  useState('treeMode', () => 'DISPLAY')
  useState('applicationMode', () => null)
  useState('isSoundOn', () => false)
  useState('scrollableCount', () => 0)

  const isOuterActive = useState('isOuterActive', () => true)
  const showNavigation = useState('showNavigation', () => false)
  const isCircleActive = useState('isCircleActive', () => false)

  const activateNavigation = () => {
    showNavigation.value = true
    setTimeout(() => isCircleActive.value = true, 500)
  }
  
  const deactivateNavigation = () => {
    isCircleActive.value = false
    setTimeout(() => showNavigation.value = false, 1000)
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
      isOuterActive,
      showNavigation,
      isCircleActive,
      activateNavigation,
      deactivateNavigation,
      toggleNavigation,
    },
  }
})
