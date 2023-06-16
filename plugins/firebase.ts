import { defineNuxtPlugin } from '#app'
import { initializeApp } from 'firebase/app'

export default defineNuxtPlugin(() => {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyB2cV8_3rFxxtrjr0UanAJpH2vtrJSZ45Y',
    authDomain: 'matrix-25053.firebaseapp.com',
    projectId: 'matrix-25053',
    storageBucket: 'matrix-25053.appspot.com',
    messagingSenderId: '575993135237',
    appId: '1:575993135237:web:3158871fd40b79b1e969ec',
  }

  // Initialize Firebase
  initializeApp(firebaseConfig)
})
