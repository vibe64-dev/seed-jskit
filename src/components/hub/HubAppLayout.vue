<script setup>
import {
  mdiAccountCircleOutline,
  mdiAccountGroupOutline,
  mdiApps,
  mdiClipboardCheckOutline,
  mdiLockOutline,
  mdiLogout
} from "@mdi/js";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { initials } from "../../lib/format.js";
import { useHubSession } from "../../lib/useHubSession.js";
import EmptyState from "./EmptyState.vue";
import HubMark from "./HubMark.vue";

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  ownerOnly: { type: Boolean, default: false }
});

const route = useRoute();
const router = useRouter();
const { mdAndUp } = useDisplay();
const { session, refreshSession, signOut } = useHubSession();
const ready = ref(session.loaded && Boolean(session.account));
const host = window.location.host;

const tabs = [
  { to: "/account", label: "Your account", icon: mdiAccountCircleOutline },
  { to: "/admin/apps", label: "Apps", icon: mdiApps },
  { to: "/admin/people", label: "People", icon: mdiAccountGroupOutline },
  { to: "/admin/setup", label: "Setup", icon: mdiClipboardCheckOutline }
];
const showTabs = computed(() => session.isOwner);
const allowed = computed(() => !props.ownerOnly || session.isOwner);

onMounted(async () => {
  try {
    await refreshSession();
  } finally {
    if (!session.account) {
      router.replace({ path: "/auth/sign-in", query: { next: route.fullPath } });
    } else {
      ready.value = true;
    }
  }
});

async function leave() {
  await signOut();
  router.replace("/auth/sign-in");
}
</script>

<template>
  <v-app-bar flat border="b" height="64" class="hub-bar">
    <div class="hub-bar__brand">
      <HubMark :size="32" />
      <div class="hub-bar__titles">
        <span class="hub-bar__name">Accounts</span>
        <span v-if="mdAndUp" class="hub-bar__host">{{ host }}</span>
      </div>
    </div>
    <nav v-if="showTabs && mdAndUp" class="hub-bar__tabs" aria-label="Hub">
      <v-btn
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        variant="text"
        :active="route.path === tab.to"
        class="hub-bar__tab"
      >
        {{ tab.label }}
      </v-btn>
    </nav>
    <v-spacer />
    <v-menu v-if="session.account" location="bottom end">
      <template #activator="{ props: menu }">
        <v-btn v-bind="menu" icon variant="text" class="mr-2" aria-label="Your account menu">
          <v-avatar size="36" color="primary" variant="tonal">
            <span class="text-body-2 font-weight-bold">{{ initials(session.account.displayName) }}</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-card min-width="260" class="pa-2">
        <div class="px-4 pt-3 pb-2">
          <div class="text-body-1 font-weight-medium text-truncate">{{ session.account.displayName }}</div>
          <div class="text-body-2 text-medium-emphasis text-truncate">{{ session.account.email }}</div>
        </div>
        <v-divider class="my-1" />
        <v-list density="comfortable" nav>
          <v-list-item :prepend-icon="mdiLogout" title="Sign out" @click="leave" />
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>

  <v-main class="hub-main">
    <v-container class="hub-main__container">
      <header class="hub-main__header">
        <div>
          <h1 class="hub-main__title">{{ title }}</h1>
          <p v-if="subtitle" class="hub-main__subtitle">{{ subtitle }}</p>
        </div>
        <div class="hub-main__actions"><slot v-if="ready && allowed" name="actions" /></div>
      </header>
      <template v-if="!ready">
        <v-skeleton-loader type="card" class="mb-4 rounded-xl" height="160" />
        <v-skeleton-loader type="card" class="rounded-xl" height="160" />
      </template>
      <v-card v-else-if="!allowed" border flat>
        <EmptyState
          :icon="mdiLockOutline"
          heading="Only the hub's owner can open this page."
          body="Your own account settings are always open to you."
        >
          <v-btn color="primary" variant="tonal" to="/account" class="mt-2">Open your account</v-btn>
        </EmptyState>
      </v-card>
      <slot v-else />
    </v-container>
  </v-main>

  <v-bottom-navigation v-if="showTabs && !mdAndUp" grow border="t" height="64" :elevation="0">
    <v-btn v-for="tab in tabs" :key="tab.to" :to="tab.to" :value="tab.to">
      <v-icon :icon="tab.icon" />
      <span class="text-caption">{{ tab.label === "Your account" ? "Account" : tab.label }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<style scoped>
.hub-bar {
  background: rgb(var(--v-theme-surface)) !important;
}
.hub-bar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 16px;
  min-width: 0;
}
.hub-bar__titles {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
  min-width: 0;
}
.hub-bar__name {
  font-weight: 650;
  font-size: 1.05rem;
}
.hub-bar__host {
  font-size: 0.8rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}
.hub-bar__tabs {
  display: flex;
  gap: 4px;
  margin-left: 32px;
}
.hub-bar__tab {
  font-weight: 500;
}
.hub-main {
  background: rgb(var(--v-theme-background));
  min-height: 100dvh;
}
.hub-main__container {
  max-width: 960px;
  padding: 32px 16px 96px;
}
.hub-main__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.hub-main__actions:empty {
  display: none;
}
.hub-main__title {
  font-size: 1.75rem;
  line-height: 1.2;
  font-weight: 650;
  letter-spacing: -0.01em;
}
.hub-main__subtitle {
  margin-top: 6px;
  color: rgba(var(--v-theme-on-background), 0.68);
}
@media (max-width: 599px) {
  .hub-main__container {
    padding-top: 20px;
  }
  .hub-main__title {
    font-size: 1.45rem;
  }
  .hub-main__header {
    margin-bottom: 16px;
  }
}
</style>
