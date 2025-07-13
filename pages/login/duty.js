export default class Duty {
  constructor(id) {
    this.id = id
  }

  setup(nuxtApp) {
    const { $api } = nuxtApp
    return Object.assign(this, { $api })
  }

  async init() {
    console.log(`${this.id} duty initialized.`, this)
  }
}
