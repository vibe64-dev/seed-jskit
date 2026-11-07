<script setup>
import { usePaths } from "@jskit-ai/shell-web/client/navigation/usePaths";

const paths = usePaths();
</script>

<template>
  <section class="d-flex flex-column ga-6">
    <v-sheet rounded="xl" border class="pa-6 pa-md-8">
      <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4">
        <div>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Update your display name, preferences, avatar, and notification choices.
          </p>
        </div>
        <v-btn color="primary" variant="flat" size="large" :to="paths.page('/', { surface: 'account' })">
          Manage account
        </v-btn>
      </div>
    </v-sheet>
  </section>
</template>
