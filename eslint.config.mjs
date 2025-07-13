import stylistic from '@stylistic/eslint-plugin'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'

import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: 'latest',
      },
    },
  },

  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
    },
  },

  // https://eslint.style/guide/config-presets#configuration-factory
  stylistic.configs.customize({
    flat: true, // required for flat config
    indent: 2,
    quotes: 'single',
    semi: false,
  }),
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
    },
  },
)
