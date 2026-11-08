<script setup>
import { usePaths } from "@jskit-ai/shell-web/client/navigation/usePaths";

const paths = usePaths();
const title = "Page not found";
const message = "The page you requested does not exist.";
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <section class="d-flex flex-column align-center text-center ga-4">
      <v-icon icon="$searchOff" size="48" class="on-surface-variant" />
      <h1 class="text-headline-medium mb-0">{{ title }}</h1>
      <p class="text-body-large on-surface-variant mb-2">{{ message }}</p>
      <v-btn color="primary" variant="flat" size="large" :to="paths.page('/', { surface: 'home' })">Go home</v-btn>
    </section>
  </v-container>
</template>
