<script setup>
defineProps({ title: { type: String, required: true }, body: { type: String, default: "" } });
</script>

<template>
  <section class="settings-section">
    <div class="settings-section__intro">
      <h2 class="settings-section__title">{{ title }}</h2>
      <p v-if="body" class="settings-section__body">{{ body }}</p>
    </div>
    <v-card border flat class="settings-section__card">
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
.settings-section__title {
  font-size: 1.05rem;
  font-weight: 600;
}
.settings-section__body {
  margin-top: 4px;
  font-size: 0.9rem;
  color: rgba(var(--v-theme-on-background), 0.66);
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
