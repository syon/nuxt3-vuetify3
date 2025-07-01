const name = 'hello'

export const usePageStore = defineStore(name, {
  state: () => ({
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
      await null
    },
    increment() {
      this.count++
    },
  },
})
