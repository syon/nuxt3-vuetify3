import { useStore as useAuthStore } from '~/pages/global/auth/store'

import Duty from './duty'

const id = 'login'
const duty = new Duty(id)

export const useStore = defineStore(id, {
  state: () => ({
    duty: duty.setup(useNuxtApp()),
    $auth: useAuthStore(),
  }),

  actions: {
    async init() {
      await duty.init()
    },
    async login({ username, password }) {
      await this.$auth.login({ username, password })
    },
  },
})
