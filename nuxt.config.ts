// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@pinia/nuxt'],

  ssr: false,

  devtools: { enabled: true },

  // https://nuxt.com/docs/getting-started/seo-meta
  app: {
    baseURL: '/nuxt3-vuetify3/',
    head: {
      title: 'Nuxt3 + Vuetify3',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'description', content: 'My amazing site.' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      htmlAttrs: {
        lang: 'ja',
      },
    },
  },

  compatibilityDate: '2024-11-01',

  eslint: {
    config: {
      stylistic: true,
    },
  },
})
