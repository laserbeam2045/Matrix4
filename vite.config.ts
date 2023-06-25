/* eslint-disable camelcase */
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import commonjsExternals from 'vite-plugin-commonjs-externals'
// import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

// import vue from '@vitejs/plugin-vue'

// export const ssrTransformCustomDir = () => {
//   return {
//     props: [],
//     needRuntime: true,
//   }
// }

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: `
          @import '@/assets/sass/app.scss';
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
})
