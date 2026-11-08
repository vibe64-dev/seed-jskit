<script setup>
import HubMark from "./HubMark.vue";

const host = typeof window === "undefined" ? "" : window.location.host;
</script>

<template>
  <v-main class="hub-auth">
    <div class="hub-auth__backdrop" aria-hidden="true" />
    <div class="hub-auth__column">
      <div class="hub-auth__brand">
        <HubMark :size="40" />
        <span class="hub-auth__titles">
          <span class="text-title-medium">Accounts</span>
          <span class="hub-auth__host text-body-small on-surface-variant">{{ host }}</span>
        </span>
      </div>
      <!-- Material 3's elevated card: surface-container-low at level 1, over the tinted backdrop. -->
      <v-card class="hub-auth__card" variant="elevated">
        <slot />
      </v-card>
      <p class="hub-auth__footnote text-body-small on-surface-variant">
        <slot name="footnote">
          <v-icon icon="$lock" size="14" />
          The apps you sign in to never see your password.
        </slot>
      </p>
    </div>
  </v-main>
</template>

<style scoped>
.hub-auth {
  position: relative;
  min-height: 100dvh;
  overflow: hidden;
}
.hub-auth__backdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60rem 40rem at 15% -10%, rgba(var(--v-theme-primary), 0.14), transparent 60%),
    radial-gradient(50rem 36rem at 110% 110%, rgba(var(--v-theme-secondary), 0.12), transparent 60%);
  pointer-events: none;
}
.hub-auth__column {
  position: relative;
  width: min(440px, 100%);
  margin: 0 auto;
  padding: clamp(32px, 10vh, 112px) 16px 32px;
}
.hub-auth__brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 28px;
}
.hub-auth__titles {
  display: grid;
  min-width: 0;
}
.hub-auth__host {
  overflow-wrap: anywhere;
}
.hub-auth__card {
  padding: 32px;
}
.hub-auth__footnote {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
  text-align: center;
}
@media (max-width: 599px) {
  .hub-auth__card {
    padding: 24px 20px;
  }
}
</style>
