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
      <div class="app-row__name">{{ app.name }}</div>
      <div class="app-row__origin">{{ app.origin }}</div>
      <div v-if="meta" class="app-row__meta">{{ meta }}</div>
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
.app-row__name {
  font-weight: 600;
}
.app-row__origin {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85rem;
  overflow-wrap: anywhere;
  color: rgba(var(--v-theme-on-surface), 0.8);
}
.app-row__meta {
  font-size: 0.8rem;
  margin-top: 2px;
  color: rgba(var(--v-theme-on-surface), 0.6);
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
