<script setup>
import { mdiLockOutline } from "@mdi/js";
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
          <span class="hub-auth__name">Accounts</span>
          <span class="hub-auth__host">{{ host }}</span>
        </span>
      </div>
      <v-card class="hub-auth__card" border flat>
        <slot />
      </v-card>
      <p class="hub-auth__footnote">
        <slot name="footnote">
          <v-icon :icon="mdiLockOutline" size="14" />
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
  background: rgb(var(--v-theme-background));
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
  line-height: 1.2;
  min-width: 0;
}
.hub-auth__name {
  font-size: 1.05rem;
  font-weight: 650;
  letter-spacing: -0.005em;
}
.hub-auth__host {
  font-size: 0.8125rem;
  color: rgba(var(--v-theme-on-background), 0.62);
  overflow-wrap: anywhere;
}
.hub-auth__card {
  padding: 32px;
  background: rgb(var(--v-theme-surface));
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 12px 40px -12px rgba(0, 0, 0, 0.18) !important;
}
.hub-auth__footnote {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
  text-align: center;
  font-size: 0.8125rem;
  color: rgba(var(--v-theme-on-background), 0.6);
}
@media (max-width: 599px) {
  .hub-auth__card {
    padding: 24px 20px;
  }
}
</style>
