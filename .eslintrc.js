/* eslint-disable @typescript-eslint/no-var-requires */
const elLintRules = require('./.eslint-rules')
const esLintPluginVueRules = require('./.eslint-plugin-vue-rules')

module.exports = {
  root: true,

  env: {
    node   : true,
    es2021 : true,
    browser: true,
  },

  extends: [
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:nuxt/recommended',
  ],

  parserOptions: {
    ecmaVersion: 2021,
    sourceType : 'module',
    parser     : '@typescript-eslint/parser',
  },

  plugins: [
    'vue',
    '@typescript-eslint',
    '@typescript-eslint/eslint-plugin',
  ],

  // overrides: [
  //   {
  //     files: ['*.vue', '*.d.ts'],
  //     rules: {
  //       'no-unused-vars'                   : 'off',
  //       '@typescript-eslint/no-unused-vars': 'error',
  //     },
  //   },
  // ],

  // settings: {
  //   'import/resolver': {
  //     'node': {
  //       'extensions': [
  //         '.js',
  //         '.jsx',
  //         '.json',
  //         '.ts',
  //         '.tsx'
  //       ]
  //     }
  //   }
  // },

  rules: {
    'no-console' : process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // 'import/no-unresolved': [
    //   2,
    //   {
    //     'ignore': [
    //       '^@components',
    //       '^@types'
    //     ]
    //   }
    // ],

    ...elLintRules,

    ...esLintPluginVueRules,

    /* prettier */

    // prettierはOFF
    'prettier/prettier': 'off',
  },
}
