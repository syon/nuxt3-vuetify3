import Duty from './duty'

const id = 'global/auth'
const duty = new Duty(id)

export const useStore = defineStore(id, {
  state: () => ({
    duty: duty.setup(useNuxtApp()),
    accessToken: null,
    refreshToken: null,
    user: null,
  }),

  getters: {
    isLoggedIn: state => !!state.accessToken && !!state.user,
    userName: state => state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
    userEmail: state => state.user?.email || '',
    userImage: state => state.user?.image || '',
  },

  actions: {
    async login(credentials) {
      this.errorMessage = null
      return await duty.login(credentials)
        .then(this.$patch)
        .catch(() => {
          throw new Error('ログイン処理中にエラーが発生しました')
        })
    },

    clearError() {
      this.errorMessage = null
    },

    async logout() {
      return await duty.logout(this)
        .then(this.$patch)
        .catch(() => {
          throw new Error('ログアウト処理中にエラーが発生しました')
        })
    },

    async refresh() {
      return await duty.refresh(this)
        .then(this.$patch)
        .catch(() => {
          throw new Error('トークンの更新に失敗しました')
        })
    },

    async validateCurrentUser() {
      return await duty.validateCurrentUser(this)
        .then(this.$patch)
        .catch(() => {
          throw new Error('ユーザー情報の検証に失敗しました')
        })
    },
  },
})
