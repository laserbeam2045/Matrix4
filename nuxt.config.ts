/* eslint-disable camelcase */
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import commonjsExternals from 'vite-plugin-commonjs-externals'
// import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

import { resolve } from 'pathe'

// import vue from '@vitejs/plugin-vue'

// export const ssrTransformCustomDir = () => {
//   return {
//     props: [],
//     needRuntime: true,
//   }
// }

// firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  ssr: true,
  // mode: 'spa',

  // nitro: {
  //   // preset: 'browser',
  //   preset: 'node',
  // },

  alias: {
    'audios': resolve(__dirname, './assets/audios'),
  },

  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          additionalData: `
            @import '/assets/sass/app.scss';
          `,
          includePaths: [
            path.resolve(__dirname, './node_modules/compass-mixins/lib'),
          ],
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 3000,
    },
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'MATRIX',
          short_name: 'MATRIX',
          description: 'The future of the world.',
          icons: [{
            src: 'favicon.png',
            sizes: '32x32',
            type: 'image/png',
          }],
          start_url: '/',
          background_color: '#0D0208',
          theme_color: '#00FF41',
          lang: 'en',
          shortcuts: [{
            name: 'MATRIX',
            short_name: 'MATRIX',
            url: 'https://matrix-code.net/',
            description: 'The future of the world.',
            // icons: ['favicon.png'],
          }],
        },
        // srcDir: '_nuxt',
        filename: 'sw.js',
        injectRegister: 'auto',
        workbox: {
          cleanupOutdatedCaches: true,
        },
      }),
      // commonjsExternals({
      //   externals: ['path'],
      // }),
      // [
        // vue({
        //   script: {
        //     defineModel: true,
        //     propsDestructure: true,
        //   }
        // })
      // ]
    ],
  },

  vue: {
    compilerOptions: {
      directiveTransforms: {
        center: () => ({
          props: [],
          needRuntime: true,
        }),
        pin: () => ({
          props: [],
          needRuntime: true,
        }),
        draggable: () => ({
          props: [],
          needRuntime: true,
        }),
        resizable: () => ({
          props: [],
          needRuntime: true,
        }),
        scroll: () => ({
          props: [],
          needRuntime: true,
        }),
        resize: () => ({
          props: [],
          needRuntime: true,
        }),
        'window-resize': () => ({
          props: [],
          needRuntime: true,
        }),
        focus: () => ({
          props: [],
          needRuntime: true,
        }),
        'quick-focus': () => ({
          props: [],
          needRuntime: true,
        }),
      },
    },
  },

  modules: [
    // '@nuxtjs/fontawesome',
    // '@nuxtjs/tailwindcss',
    // './assets/css/tailwind.css',
    // 'tailwindcss/tailwind.css',
    // '@nuxtjs/tailwindcss',
    // '@vitejs/plugin-vue',
    // '@nuxtjs/pwa',
    '@nuxt/ui'
  ],

  css: [
    // 'tailwindcss/tailwind.css',
    '~/assets/css/tailwind.css',
    '@fortawesome/fontawesome-svg-core/styles.css',
  ],

  watch: [
    '~/postcss.config.js',
    '~/tailwind.config.js',
  ],

  build: {
    // postcss: {
    //   postcssOptions: require('./postcss.config.js'),
    // },
    // loaders: {
    //   vue: {
    //     transformAssetUrls: {
    //       source: 'src',
    //     },
    //   },
    // },
    // rollupOptions: {
    //   external: false,
    // },
  },

  // buildModules: [
  //   '@vueuse/nuxt',
  // ],

  // fontawesome: {
  //   icons: {
  //     solid: FontAwesome.solid,
  //     regular: FontAwesome.regular,
  //     brands: FontAwesome.brands
  //   },
  // },

  // meta: {
  //   // meta: [
  //   //   { name: 'viewport', content: 'initial-scale=1.0' },
  //   // ],
  //   // style: [
  //   //   {
  //   //     children: `
  //   //       :root, body, #__nuxt {
  //   //         position: relative;
  //   //         margin: 0;
  //   //         padding: 0;
  //   //         min-width: 100vw;
  //   //         min-height: 100vh;
  //   //       }
  //   //       body {
  //   //         color: #17d2cf;
  //   //         background: #070b17;
  //   //       }
  //   //     `,
  //   //     type: 'text/css',
  //   //   },
  //   // ],
  // },

  typescript: {
    strict: false,
  },

  runtimeConfig: {
    apiSecret: '123',
    public: {
      firebaseConfig: process.env.NODE_ENV === 'production'
        ? {}
        : firebaseConfig,
      // firebaseConfig: firebaseConfig,
      API_PATH: process.env.API_PATH,
    },
  },

  // privateRuntimeConfig: {
  //   dataOf: 'private',
  //   // firebaseConfig,
  // },
})
