<script setup>
// 認証ガードミドルウェアを適用
definePageMeta({
  middleware: 'auth-guard',
})
</script>

<template>
  <div>
    <GlobalHeader />
    <NuxtPage />
  </div>
</template>
