<script setup>
import { mdiShieldAccountOutline } from "@mdi/js";

defineProps({ size: { type: Number, default: 40 } });
</script>

<template>
  <v-avatar :size="size" color="primary" variant="tonal" class="hub-mark" aria-hidden="true">
    <v-icon :icon="mdiShieldAccountOutline" :size="Math.round(size * 0.55)" />
  </v-avatar>
</template>
