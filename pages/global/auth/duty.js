import { DummyJSON } from '@/app/Endpoints'

export default class Duty {
  constructor(id) {
    this.id = id
  }

  setup(nuxtApp) {
    const { $api } = nuxtApp
    return Object.assign(this, { $api })
  }

  async login(credentials) {
    const response = await this.$api(DummyJSON.AuthLogin, {
      body: {
        username: credentials.username,
        password: credentials.password,
        expiresInMins: 60,
      },
    })

    const authResult = {
      user: {
        email: response.email,
        firstName: response.firstName,
        gender: response.gender,
        id: response.id,
        image: response.image,
        lastName: response.lastName,
        username: response.username,
      },
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    }

    this.saveTokensToStorage(authResult)

    return authResult
  }

  async logout() {
    this.clearTokensFromStorage()
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
    }
  }

  saveTokensToStorage(args) {
    localStorage.setItem('accessToken', args.accessToken || '')
    localStorage.setItem('refreshToken', args.refreshToken || '')
    localStorage.setItem('user', JSON.stringify(args.user || {}))
  }

  clearTokensFromStorage() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  loadTokensFromStorage() {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      const user = JSON.parse(localStorage.getItem('user'))
      return { accessToken, refreshToken, user }
    }
    catch (error) {
      console.error('Failed to parse user data:', error)
      this.clearTokensFromStorage()
      return { accessToken: null, refreshToken: null, user: null }
    }
  }

  async refresh(state) {
    const { refreshToken } = state
    const response = await this.$api(DummyJSON.AuthRefresh, {
      body: {
        refreshToken,
        expiresInMins: 60,
      },
    })

    this.saveTokensToStorage(response)

    return {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    }
  }

  async validateCurrentUser(state) {
    const { accessToken } = state
    if (!accessToken) {
      throw new Error('No access token provided for user validation.')
    }
    const response = await this.$api(DummyJSON.AuthMe, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return {
      user: response,
    }
  }
}
