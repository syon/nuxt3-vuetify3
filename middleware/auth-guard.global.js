import { useStore } from '~/store/global/auth'

const EXCLUDED_ROUTES = ['/login', '/logout']

// https://nuxt.com/docs/guide/directory-structure/middleware
export default defineNuxtRouteMiddleware(async (to) => {
  console.log('middleware', to)

  if (EXCLUDED_ROUTES.includes(to.path)) {
    return
  }

  const $auth = useStore()
  await $auth.check()

  if (!$auth.isLoggedIn) {
    return navigateTo('/login')
  }
})
