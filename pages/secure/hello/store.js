import Duty from './duty'

const id = 'secure/hello'
const duty = new Duty(id)

export const usePageStore = defineStore(id, {
  state: () => ({
    duty: duty.setup(useNuxtApp()),
    count: 0,
    name: 'Eduardo',
  }),
  getters: {
    doubleCount(state) {
      return state.count * 2
    },
  },
  actions: {
    async init() {
      await duty.init()
    },
    increment() {
      this.count++
    },
  },
})
