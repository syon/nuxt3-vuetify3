<script setup>
// 認証ガードミドルウェアを適用
definePageMeta({
  middleware: 'auth-guard',
})

// 認証ストアから現在のユーザー情報を取得
const { useStore: useAuthStore } = await import('~/pages/global/auth/store')
const authStore = useAuthStore()

const handleLogout = async () => {
  try {
    await authStore.logout()
    await navigateTo('/login')
  }
  catch (error) {
    console.error('Logout error:', error)
  }
}

onMounted(() => {
  console.log('Secure page mounted for user:', authStore.userName)
})
</script>

<template>
  <div class="secure-container">
    <div class="secure-card">
      <h1 class="secure-title">
        セキュアページ
      </h1>

      <div class="user-info">
        <h2>ようこそ、{{ authStore.userName }}さん！</h2>

        <div class="user-details">
          <div class="detail-item">
            <strong>ユーザー名:</strong> {{ authStore.user?.username }}
          </div>
          <div class="detail-item">
            <strong>メールアドレス:</strong> {{ authStore.userEmail }}
          </div>
          <div class="detail-item">
            <strong>ユーザーID:</strong> {{ authStore.user?.id }}
          </div>
        </div>

        <div
          v-if="authStore.userImage"
          class="user-avatar"
        >
          <img
            :src="authStore.userImage"
            :alt="authStore.userName"
          >
        </div>
      </div>

      <div class="actions">
        <button
          class="logout-button"
          @click="handleLogout"
        >
          ログアウト
        </button>

        <NuxtLink
          to="/"
          class="home-link"
        >
          ホームへ戻る
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.secure-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  padding: 2rem;
}

.secure-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  text-align: center;
}

.secure-title {
  color: #333;
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

.user-info {
  margin-bottom: 2rem;
}

.user-info h2 {
  color: #28a745;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.user-details {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  text-align: left;
}

.detail-item {
  margin-bottom: 0.75rem;
  color: #555;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item strong {
  color: #333;
  display: inline-block;
  width: 120px;
}

.user-avatar {
  margin-top: 1rem;
}

.user-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #28a745;
  object-fit: cover;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.logout-button {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.logout-button:hover {
  background: #c82333;
  transform: translateY(-2px);
}

.home-link {
  background: #6c757d;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
  display: inline-block;
}

.home-link:hover {
  background: #5a6268;
  transform: translateY(-2px);
}
</style>
