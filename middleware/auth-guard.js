export default defineNuxtRouteMiddleware(async (to, from) => {
  // 認証ストアを取得
  const { useStore: useAuthStore } = await import('~/pages/global/auth/store')
  const authStore = useAuthStore()

  try {
    // 認証ストアを初期化
    await authStore.init()

    // アクセストークンがある場合はユーザー情報を検証
    if (authStore.accessToken) {
      try {
        await authStore.validateCurrentUser()
      }
      catch (error) {
        // ユーザー情報検証に失敗した場合、トークンリフレッシュを試行
        console.log('User validation failed, attempting token refresh...')
        try {
          await authStore.refresh()
          // リフレッシュ成功後、再度ユーザー情報を検証
          await authStore.validateCurrentUser()
        }
        catch (refreshError) {
          // リフレッシュも失敗した場合は認証状態をクリア
          console.log('Token refresh failed, clearing auth state...')
          await authStore.logout()
        }
      }
    }

    // 認証状態をチェック
    if (!authStore.isLoggedIn) {
      console.log('User not authenticated, redirecting to login...')

      // ログインページ以外からのアクセスの場合、リダイレクト後に元のページに戻れるようクエリパラメータに保存
      const redirectPath = to.path !== '/login' ? to.fullPath : '/'

      return navigateTo({
        path: '/login',
        query: { redirect: redirectPath },
      })
    }

    console.log('User authenticated, allowing access to:', to.path)
  }
  catch (error) {
    console.error('Auth guard error:', error)

    // エラーが発生した場合はログインページにリダイレクト
    return navigateTo({
      path: '/login',
    })
  }
})
