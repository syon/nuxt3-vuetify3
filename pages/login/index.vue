<script setup>
import { useStore } from './store.js'

const $pg = useStore()

const form = reactive({
  username: '',
  password: '',
})

const formErrors = reactive({
  username: '',
  password: '',
})

const showPassword = ref(false)
const errorMessage = ref(null)

const validateForm = () => {
  formErrors.username = ''
  formErrors.password = ''
  if (!form.username.trim()) {
    formErrors.username = 'ユーザー名を入力してください'
  }
  if (!form.password.trim()) {
    formErrors.password = 'パスワードを入力してください'
  }
  return !formErrors.username && !formErrors.password
}

const onLogin = async () => {
  if (!validateForm()) {
    return
  }

  await $pg.login({
    username: form.username.trim(),
    password: form.password,
  }).then(async () => {
    // redirectクエリパラメータがある場合はそのページに、なければ/secure/helloページに遷移
    const route = useRoute()
    const redirectPath = route.query.redirect || '/secure/hello'
    await navigateTo(redirectPath)
  }).catch((error) => {
    errorMessage.value = error.message || 'ログインに失敗しました'
  })
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

onMounted(async () => {
  console.log('Login page mounted.')
  await $pg.init()

  // 既にログイン済みの場合はリダイレクト
  const { useStore: useAuthStore } = await import('~/pages/global/auth/store')
  const authStore = useAuthStore()
  await authStore.init()

  if (authStore.isLoggedIn) {
    const route = useRoute()
    const redirectPath = route.query.redirect || '/secure'
    await navigateTo(redirectPath)
  }
})
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">
        ログイン
      </h1>

      <form
        class="login-form"
        @submit.prevent="onLogin"
      >
        <div class="form-group">
          <label
            for="username"
            class="form-label"
          >
            ユーザー名
          </label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            class="form-input"
            :class="{ error: formErrors.username }"
            placeholder="ユーザー名を入力"
            autocomplete="username"
          >
          <div
            v-if="formErrors.username"
            class="error-message"
          >
            {{ formErrors.username }}
          </div>
        </div>

        <div class="form-group">
          <label
            for="password"
            class="form-label"
          >
            パスワード
          </label>
          <div class="password-wrapper">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              :class="{ error: formErrors.password }"
              placeholder="パスワードを入力"
              autocomplete="current-password"
            >
            <button
              type="button"
              class="password-toggle"
              :aria-label="showPassword ? 'パスワードを隠す' : 'パスワードを表示'"
              @click="togglePassword"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>
          <div
            v-if="formErrors.password"
            class="error-message"
          >
            {{ formErrors.password }}
          </div>
        </div>

        <div
          v-if="errorMessage"
          class="error-message global-error"
        >
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          class="login-button"
          :disabled="$pg.loading"
        >
          <span v-if="$pg.loading">ログイン中...</span>
          <span v-else>ログイン</span>
        </button>
      </form>

      <div class="demo-info">
        <h3>デモ用ログイン情報</h3>
        <p><strong>ユーザー名:</strong> emilys</p>
        <p><strong>パスワード:</strong> emilyspass</p>
        <small>※ DummyJSONのテストアカウントです</small>
      </div>

      <div
        v-if="$route.query.redirect"
        class="redirect-info"
      >
        <small>ログイン後、「{{ $route.query.redirect }}」ページに戻ります</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  padding: 3rem;
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 2rem;
  font-weight: 600;
}

.login-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-input.error {
  border-color: #e74c3c;
}

.password-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
}

.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.global-error {
  text-align: center;
  padding: 1rem;
  background: #ffeaea;
  border: 1px solid #e74c3c;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.login-button {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.demo-info {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  border: 1px solid #e9ecef;
}

.demo-info h3 {
  margin: 0 0 1rem 0;
  color: #495057;
  font-size: 1.1rem;
}

.demo-info p {
  margin: 0.5rem 0;
  color: #6c757d;
}

.demo-info small {
  color: #868e96;
  font-style: italic;
}

.redirect-info {
  background: #e7f3ff;
  border: 1px solid #b3d9ff;
  border-radius: 6px;
  padding: 0.75rem;
  margin-top: 1rem;
  text-align: center;
}

.redirect-info small {
  color: #0066cc;
  font-weight: 500;
}
</style>
