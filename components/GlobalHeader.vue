<script setup>
const { useStore: useAuthStore } = await import('~/pages/global/auth/store')

const authStore = useAuthStore()

const handleLogout = async () => {
  try {
    await authStore.logout()
    await navigateTo('/login')
  }
  catch (error) {
    console.error('ログアウトに失敗しました:', error)
  }
}

onMounted(() => {
  authStore.init()
})
</script>

<template>
  <header style="padding: 16px; border-bottom: 1px solid #ddd; background: white;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h1 style="margin: 0; font-size: 20px;">
        セキュアエリア
      </h1>

      <div
        v-if="authStore.isLoggedIn"
        style="display: flex; align-items: center; gap: 16px;"
      >
        <span style="font-size: 14px;">{{ authStore.userName }}</span>
        <button
          style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;"
          @click="handleLogout"
        >
          ログアウト
        </button>
      </div>

      <div
        v-else
        style="font-size: 14px; color: #666;"
      >
        ログインしていません
      </div>
    </div>
  </header>
</template>
