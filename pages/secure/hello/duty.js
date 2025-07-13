export default class Duty {
  constructor(id) {
    this.id = id
  }

  setup(nuxtApp) {
    const { $api } = nuxtApp
    return Object.assign(this, { $api })
  }

  async init() {
    await null
    console.log(`${this.id} duty initialized.`, this)
  }
}
