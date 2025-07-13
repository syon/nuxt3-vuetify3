<script setup>
import { useStore } from './store.js'

const $pg = useStore()

const showPassword = ref(false)
const errorMessage = ref(null)

const onSubmit = async (values) => {
  await $pg.login({
    username: values.username.trim(),
    password: values.password,
  }).then(async () => {
    // redirectクエリパラメータがある場合はそのページに、なければ/secure/helloページに遷移
    const route = useRoute()
    const redirectPath = route.query.redirect || '/secure/profile'
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
    const redirectPath = route.query.redirect || '/secure/profile'
    await navigateTo(redirectPath)
  }
})
</script>

<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <v-row justify="center" align="center" style="min-height: 100vh;">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card elevation="10" rounded="lg">
              <v-card-title>
                <h1>Login</h1>
              </v-card-title>

              <v-card-text>
                <ValidationForm @submit="onSubmit">
                  <ValidationField name="username" rules="required">
                    <template #default="{ field, meta }">
                      <v-text-field
                        v-bind="field"
                        label="ユーザー名"
                        placeholder="ユーザー名を入力"
                        autocomplete="username"
                        :error="!meta.valid && meta.dirty"
                        variant="outlined"
                        prepend-inner-icon="mdi-account"
                      />
                    </template>
                  </ValidationField>
                  <ValidationErrorMessage name="username" />

                  <ValidationField name="password" rules="required">
                    <template #default="{ field, meta }">
                      <v-text-field
                        v-bind="field"
                        label="パスワード"
                        placeholder="パスワードを入力"
                        autocomplete="current-password"
                        :type="showPassword ? 'text' : 'password'"
                        :error="!meta.valid && meta.dirty"
                        variant="outlined"
                        prepend-inner-icon="mdi-lock"
                        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="togglePassword"
                      />
                    </template>
                  </ValidationField>
                  <ValidationErrorMessage name="password" />

                  <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4">
                    {{ errorMessage }}
                  </v-alert>

                  <v-btn
                    type="submit"
                    block
                    size="large"
                    color="primary"
                    :loading="$pg.loading"
                    :disabled="$pg.loading"
                  >
                    {{ $pg.loading ? 'ログイン中...' : 'ログイン' }}
                  </v-btn>
                </ValidationForm>

                <v-card class="mt-6" variant="tonal" color="info">
                  <v-card-title>
                    <h3>デモ用ログイン情報</h3>
                  </v-card-title>
                  <v-card-text>
                    <p><strong>ユーザー名:</strong> emilys</p>
                    <p><strong>パスワード:</strong> emilyspass</p>
                    <small>※ DummyJSONのテストアカウントです</small>
                  </v-card-text>
                </v-card>

                <v-alert v-if="$route.query.redirect" type="info" variant="tonal" class="mt-4">
                  <small>ログイン後、「{{ $route.query.redirect }}」ページに戻ります</small>
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
