import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  const color = useState('color', () => '#000')
  const bgColor = useState('bgColor', () => '#fff')

  watch(color, (val: string) => {
    if (document) {
      document.body.style.color = val
    }
  })

  watch(bgColor, (val: string) => {
    if (document) {
      document.body.style.background = val
    }
  })
})
