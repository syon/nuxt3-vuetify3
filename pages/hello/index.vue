<script setup>
import { usePageStore } from './store.js'

const $pg = usePageStore()

onMounted(async () => {
  console.log('Hello from onMounted.')
  await $pg.init()
})
</script>

<template>
  <div>
    <p>Hello, I'm {{ $pg.name }}.</p>
    <p>Count: {{ $pg.count }}</p>
    <p>Double Count: {{ $pg.doubleCount }}</p>
    <button @click="$pg.increment()">
      Increment
    </button>
    <button @click="$pg.count = 0">
      Reset
    </button>
  </div>
</template>
