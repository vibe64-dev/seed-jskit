<script setup>
defineProps({ size: { type: Number, default: 40 } });
</script>

<template>
  <v-avatar :size="size" color="primary-container" class="hub-mark" aria-hidden="true">
    <v-icon icon="$shieldPerson" :size="Math.round(size * 0.55)" />
  </v-avatar>
</template>
