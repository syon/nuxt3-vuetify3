<script setup>
import { usePageStore } from './store.js'

const $pg = usePageStore()

onMounted(async () => {
  console.log('Hello from onMounted.')
  await $pg.init()
})
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="4" rounded="lg">
          <v-card-title class="text-h4 text-center pa-6">
            Hello Page
          </v-card-title>

          <v-card-text class="text-center">
            <v-chip color="primary" variant="tonal" size="large" class="mb-4">
              {{ $pg.name }}
            </v-chip>

            <v-row justify="center" class="my-6">
              <v-col cols="auto">
                <v-card variant="outlined" class="pa-4">
                  <div class="text-h6 text-primary">
                    Count
                  </div>
                  <div class="text-h3">
                    {{ $pg.count }}
                  </div>
                </v-card>
              </v-col>
              <v-col cols="auto">
                <v-card variant="outlined" class="pa-4">
                  <div class="text-h6 text-secondary">
                    Double Count
                  </div>
                  <div class="text-h3">
                    {{ $pg.doubleCount }}
                  </div>
                </v-card>
              </v-col>
            </v-row>

            <v-row justify="center" class="mt-6">
              <v-col cols="auto">
                <v-btn color="primary" size="large" prepend-icon="mdi-plus" @click="$pg.increment()">
                  Increment
                </v-btn>
              </v-col>
              <v-col cols="auto">
                <v-btn color="secondary" size="large" variant="outlined" prepend-icon="mdi-refresh" @click="$pg.count = 0">
                  Reset
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
