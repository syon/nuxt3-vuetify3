import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import { ja } from 'vuetify/locale'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: false,
    locale: {
      locale: 'ja',
      messages: { ja },
    },
    theme: {
      defaultTheme: 'calmPink',
      themes: {
        calmPink: {
          dark: false,
          colors: {
            'primary': '#D48CA0',
            'secondary': '#E8B4CD',
            'accent': '#F5E6E8',
            'error': '#E57373',
            'warning': '#FFB74D',
            'info': '#B39DDB',
            'success': '#81C784',
            'surface': '#FEFEFE',
            'background': '#FDF8F9',
            'on-primary': '#FFFFFF',
            'on-secondary': '#5D4037',
            'on-surface': '#2D2D2D',
            'on-background': '#2D2D2D',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
