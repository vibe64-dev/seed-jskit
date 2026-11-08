<script setup>
import { usePaths } from "@jskit-ai/shell-web/client/navigation/usePaths";

const paths = usePaths();
</script>

<template>
  <section class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4 py-2">
    <p class="text-body-large on-surface-variant mb-0">
      Update your display name, preferences, avatar, and notification choices.
    </p>
    <v-btn color="primary" variant="flat" size="large" :to="paths.page('/', { surface: 'account' })">
      Manage account
    </v-btn>
  </section>
</template>
