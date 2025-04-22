<script setup>
import { useStore } from '~/store/global/auth'

const $auth = useStore()
</script>

<template>
  <div>
    <h1>pages/login.vue</h1>
    <NuxtLink to="/">Go to index</NuxtLink>
    <div>
      $auth.isLoggedIn: {{ $auth.isLoggedIn }}
      <br>
      <button @click="$auth.login()">
        Login
      </button>
    </div>
  </div>
</template>
