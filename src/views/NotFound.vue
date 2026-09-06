<script setup>
const title = "Page not found";
const message = "The page you requested does not exist.";
</script>

<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-sheet class="pa-6 pa-md-8 text-center" max-width="560" rounded="xl" border>
      <h1 class="text-h4 mb-3">{{ title }}</h1>
      <p class="text-body-1 text-medium-emphasis mb-6">{{ message }}</p>
      <v-btn color="primary" variant="flat" size="large" to="/home">Go home</v-btn>
    </v-sheet>
  </v-container>
</template>
