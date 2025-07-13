import { useStore as useAuthStore } from '~/pages/global/auth/store'

// eslint-disable-next-line import/order
import Duty from './duty'

const id = 'secure/profile'
const duty = new Duty(id)

export const usePageStore = defineStore(id, {
  state: () => ({
    duty: duty.setup(useNuxtApp()),
    $auth: useAuthStore(),
  }),
  getters: {
  },
  actions: {
    async init() {
      await duty.init()
    },
  },
})
