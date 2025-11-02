/* eslint-disable camelcase */
// import { defineConfig } from 'vite'
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

  // PWA Configuration for @vite-pwa/nuxt
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'MATRIX',
      short_name: 'MATRIX',
      description: 'The future of the world.',
      theme_color: '#00FF41',
      background_color: '#000000',
      display: 'standalone',
      start_url: '/',
      lang: 'ja',
      icons: [
        {
          src: '/pwa-64x64.png?v=2',
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: '/pwa-192x192.png?v=2',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-512x512.png?v=2',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/maskable-icon-512x512.png?v=2',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'gstatic-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    },
    client: {
      installPrompt: true,
      // Automatically register service worker after 60 seconds of inactivity
      periodicSyncForUpdates: 3600
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  },

  // nitro: {
  //   // preset: 'browser',
  //   preset: 'node',
  // },
  // mode: 'spa',

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
      commonjsExternals({
        externals: ['path'],
      }),
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

  // pwa: {
  //   registerType: "autoUpdate",
  //   includeAssets: ["favicon.ico"],
  //   client: {
  //     installPrompt: true,
  //   },
  //   manifest: {
  //     name: 'name',
  //     description: "description",
  //     theme_color: "#ffffff",
  //     lang: "ja",
  //     short_name: "short_name",
  //     start_url: "/",
  //     display: "standalone",
  //     background_color: "#ffffff",
  //     icons: [
  //       {
  //         src: "icons/36x36.png",
  //         sizes: "36x36",
  //         type: "image/png"
  //       },
  //       {
  //         src: "icons/48x48.png",
  //         sizes: "48x48",
  //         type: "image/png"
  //       },
  //       {
  //         src: "icons/72x72.png",
  //         sizes: "72x72",
  //         type: "image/png"
  //       },
  //       {
  //         src: "icons/96x96.png",
  //         sizes: "96x96",
  //         type: "image/png"
  //       },
  //       {
  //         src: "icons/128x128.png",
  //         sizes: "128x128",
  //         type: "image/png"
  //       },
  //       {
  //         src: "icons/144x144.png",
  //         sizes: "144x144",
  //         type: "image/png"
  //       },
  //       {
  //         src: "icons/152x152.png",
  //         sizes: "152x152",
  //         type: "image/png"
  //       },
  //       {
  //         src: "icons/192x192.png",
  //         sizes: "192x192",
  //         type: "image/png"
  //       },
  //       {
  //         src: "icons/256x256.png",
  //         sizes: "256x256",
  //         type: "image/png"
  //       },
  //       {
  //         src: "icons/384x384.png",
  //         sizes: "384x384",
  //         type: "image/png"
  //       },
  //       {
  //         src: "icons/512x512.png",
  //         sizes: "512x512",
  //         type: "image/png"
  //       }
  //     ]
  //   },
  //   workbox: {
  //     navigateFallback: null
  //   },
  //   devOptions: {
  //     enabled: true,
  //     type: "module"
  //   },
  //   icon: {
  //     source: "icon.png",
  //   }
  // },

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
    '@vite-pwa/nuxt',
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
      // firebaseConfig: process.env.NODE_ENV === 'production'
      //   ? {}
      //   : firebaseConfig,
      firebaseConfig: firebaseConfig,
      API_PATH: process.env.API_PATH,
      API_PATH_2: process.env.API_PATH_2,
      ASSETS_PATH: process.env.ASSETS_PATH,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },

  // privateRuntimeConfig: {
  //   dataOf: 'private',
  //   // firebaseConfig,
  // },
})
