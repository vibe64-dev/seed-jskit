<script setup>
import AppAvatar from "./AppAvatar.vue";

defineProps({
  app: { type: Object, required: true },
  meta: { type: String, default: "" }
});
</script>

<template>
  <div class="app-row">
    <AppAvatar :name="app.name" :size="44" />
    <div class="app-row__text">
      <div class="app-row__name text-title-medium">{{ app.name }}</div>
      <div class="app-row__origin text-body-medium on-surface-variant">{{ app.origin }}</div>
      <div v-if="meta" class="app-row__meta text-body-small on-surface-variant">{{ meta }}</div>
    </div>
    <div class="app-row__actions"><slot /></div>
  </div>
</template>

<style scoped>
.app-row {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
}
.app-row + .app-row {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.app-row__origin {
  overflow-wrap: anywhere;
}
.app-row__meta {
  margin-top: 2px;
}
.app-row__actions {
  display: flex;
  gap: 8px;
}
@media (max-width: 599px) {
  .app-row {
    grid-template-columns: 44px minmax(0, 1fr);
    padding: 16px;
  }
  .app-row__actions {
    grid-column: 2;
    flex-wrap: wrap;
    /* Text buttons line up with the name above them. */
    margin-inline-start: -12px;
    margin-top: -8px;
  }
}
</style>
