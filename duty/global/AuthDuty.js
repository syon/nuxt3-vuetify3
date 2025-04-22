export default class Duty {
  setup(nuxtApp) {
    const { $api, $DU } = nuxtApp
    return Object.assign(this, { $api, $DU })
  }

  async login({ username, password }) {
    console.log({ username, password })
  }

  async logout() {}

  async check() {
    return {
      id: '1234567890',
      email: 'admin@hello.internal',
      username: '',
    }
  }
}
