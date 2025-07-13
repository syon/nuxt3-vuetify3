<script setup>
import { usePageStore } from './store.js'

const $pg = usePageStore()

onMounted(async () => {
  await $pg.init()
})
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card rounded="lg">
          <v-card-title class="text-h4 text-center pa-6">
            Profile
          </v-card-title>

          <v-card-text>
            <pre>

              {{ JSON.stringify($pg.$auth.profile, null, 2) }}
            </pre>
          </v-card-text>
        </v-card>

        <div class="text-center mt-4">
          <v-btn to="/secure/hello">Hello</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
