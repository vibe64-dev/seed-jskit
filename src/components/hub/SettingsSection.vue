<script setup>
defineProps({ title: { type: String, required: true }, body: { type: String, default: "" } });
</script>

<template>
  <section class="settings-section">
    <div class="settings-section__intro">
      <h2 class="text-title-medium">{{ title }}</h2>
      <p v-if="body" class="settings-section__body text-body-medium on-surface-variant">{{ body }}</p>
    </div>
    <v-card class="settings-section__card">
      <slot />
    </v-card>
  </section>
</template>

<style scoped>
.settings-section {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 24px 40px;
  padding: 24px 0;
}
.settings-section:first-of-type {
  padding-top: 0;
}
.settings-section + .settings-section {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.settings-section__body {
  margin-top: 4px;
}
.settings-section__card {
  padding: 20px 24px;
}
@media (max-width: 959px) {
  .settings-section {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
  .settings-section__card {
    padding: 16px;
  }
}
</style>
