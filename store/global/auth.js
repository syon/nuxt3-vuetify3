import { defineStore } from 'pinia'

import Duty from '~/duty/global/AuthDuty'

const name = 'global/auth'
const duty = new Duty()

const initialState = () => ({
  id: null,
  email: null,
  username: null,
})

export const useStore = defineStore(name, {
  state: () => ({
    duty: duty.setup(useNuxtApp()),
    ...initialState(),
  }),
  getters: {
    isLoggedIn: (state) => {
      return state.id !== null
    },
  },
  actions: {
    async login({ username, password }) {
      this.$patch(initialState())
      try {
        await duty.login({ username, password })
        await this.check()
      }
      catch (e) {
        console.error(e)
        throw e
      }
    },
    async logout() {
      try {
        await duty.logout()
        this.$patch(initialState())
      }
      catch (e) {
        console.error(e)
      }
    },
    async check() {
      try {
        await duty.check().then(this.$patch)
      }
      catch (e) {
        console.error(e)
      }
    },
  },
})
