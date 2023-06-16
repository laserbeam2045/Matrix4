import { defineNuxtPlugin } from '#app'
import { config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

config.autoAddCss = false

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.component('fa', FontAwesomeIcon)
})
