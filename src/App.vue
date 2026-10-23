<script setup>
import { RouterView } from "vue-router";
import ShellErrorHost from "@jskit-ai/shell-web/client/components/ShellErrorHost";
</script>

<template>
  <v-app>
    <RouterView />
    <ShellErrorHost />
  </v-app>
</template>

<style>
/* The hub ships no web font: the platform's own UI font reads best and loads instantly. */
.v-application {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
</style>
