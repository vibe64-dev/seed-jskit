<script setup>
defineProps({
  icon: { type: String, required: true },
  heading: { type: String, required: true },
  body: { type: String, default: "" }
});
</script>

<template>
  <div class="empty-state">
    <v-avatar size="64" color="primary" variant="tonal">
      <v-icon :icon="icon" size="30" />
    </v-avatar>
    <p class="empty-state__heading">{{ heading }}</p>
    <p v-if="body" class="empty-state__body">{{ body }}</p>
    <slot />
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 16px;
  gap: 8px;
}
.empty-state__heading {
  margin: 8px 0 0;
  font-size: 1.05rem;
  font-weight: 600;
}
.empty-state__body {
  margin: 0 0 8px;
  max-width: 420px;
  color: rgba(var(--v-theme-on-surface), 0.68);
}
</style>
