import { localize, setLocale } from '@vee-validate/i18n'
import ja from '@vee-validate/i18n/dist/locale/ja.json'
import { all } from '@vee-validate/rules'
import { configure, defineRule, ErrorMessage, Field, Form } from 'vee-validate'

/**
 * VeeValidate
 *   利用可能なルール
 *     https://vee-validate.logaretm.com/v4/guide/global-validators#available-rules
 *   参考
 *     https://tech.andpad.co.jp/entry/2022/12/05/100000
 */
export default defineNuxtPlugin((nuxtApp) => {
  Object.entries(all).forEach(([name, rule]) => {
    defineRule(name, rule)
  })

  nuxtApp.vueApp.component('ValidationForm', Form)
  nuxtApp.vueApp.component('ValidationField', Field)
  nuxtApp.vueApp.component('ValidationErrorMessage', ErrorMessage)

  configure({
    generateMessage: localize({ ja }),
  })

  setLocale('ja')

  // [same]カスタムルール
  defineRule('same', (value, [str, name]) => {
    if (value !== str) {
      return `${name}と一致しません。`
    }
    return true
  })

  // [password]カスタムルール
  defineRule('password', (value) => {
    // 記号 ! ? _ + * ' " ` # $ % & - ^ \ @ ; : . / = ~ [ ] ( ) { } < >
    // ※ルール記法の制約上、カンマとパイプは使用できない
    const reg = /^[a-zA-Z0-9!?_+*'"`#$%&\-^\\@;:./=~[\](){}<>]+$/
    if (!reg.test(value)) {
      return '使用できない文字が含まれています。'
    }
    return true
  })
})
