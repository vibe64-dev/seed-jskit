<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { usePaths } from "@jskit-ai/shell-web/client/navigation/usePaths";
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
const paths = usePaths();
const { mdAndUp } = useDisplay();
const { session, refreshSession, signOut } = useHubSession();
const ready = ref(session.loaded && Boolean(session.account));
const host = window.location.host;
// Material 3's top app bar rests on surface and moves to surface-container once the page scrolls under it.
const scrolled = ref(false);
const onScroll = () => {
  scrolled.value = window.scrollY > 0;
};

const accountPage = paths.page("/", { surface: "account" });
const signInPage = paths.page("/sign-in", { surface: "auth" });
const tabs = [
  { to: accountPage, label: "Your account", shortLabel: "Account", icon: "$accountCircle" },
  { to: paths.page("/apps", { surface: "admin" }), label: "Apps", shortLabel: "Apps", icon: "$apps" },
  { to: paths.page("/people", { surface: "admin" }), label: "People", shortLabel: "People", icon: "$group" },
  { to: paths.page("/setup", { surface: "admin" }), label: "Setup", shortLabel: "Setup", icon: "$checklist" }
];
const showTabs = computed(() => session.isOwner);
const allowed = computed(() => !props.ownerOnly || session.isOwner);

onMounted(async () => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  try {
    await refreshSession();
  } finally {
    if (!session.account) {
      router.replace({ path: signInPage, query: { next: route.fullPath } });
    } else {
      ready.value = true;
    }
  }
});

onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));

async function leave() {
  await signOut();
  router.replace(signInPage);
}
</script>

<template>
  <v-app-bar :color="scrolled ? 'surface-container' : 'surface'">
    <div class="hub-bar__brand">
      <HubMark :size="32" />
      <div class="hub-bar__titles">
        <span class="text-title-medium">Accounts</span>
        <span v-if="mdAndUp" class="text-body-small on-surface-variant">{{ host }}</span>
      </div>
    </div>
    <nav v-if="showTabs && mdAndUp" class="hub-bar__tabs" aria-label="Hub">
      <!-- The current destination is a pill in secondary-container, as Material 3 marks the active navigation item; the
           others are text in on-surface-variant, as JSKIT's own navigation items draw them. -->
      <v-btn
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        :variant="route.path === tab.to ? 'flat' : 'text'"
        :color="route.path === tab.to ? 'secondary-container' : 'on-surface-variant'"
        class="hub-bar__tab"
      >
        {{ tab.label }}
      </v-btn>
    </nav>
    <v-spacer />
    <v-menu v-if="session.account" location="bottom end">
      <template #activator="{ props: menu }">
        <v-btn v-bind="menu" icon variant="text" class="mr-2" aria-label="Your account menu">
          <v-avatar size="36" color="primary-container">
            <span class="text-label-large">{{ initials(session.account.displayName) }}</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-card min-width="260" color="surface-container" variant="elevated" class="pa-2">
        <div class="px-4 pt-3 pb-2">
          <div class="text-title-medium text-truncate">{{ session.account.displayName }}</div>
          <div class="text-body-medium on-surface-variant text-truncate">{{ session.account.email }}</div>
        </div>
        <v-divider class="my-1" />
        <v-list density="comfortable" nav role="menu">
          <v-list-item role="menuitem" prepend-icon="$logout" title="Sign out" @click="leave" />
        </v-list>
      </v-card>
    </v-menu>
  </v-app-bar>

  <v-main class="hub-main">
    <v-container class="hub-main__container">
      <header class="hub-main__header">
        <div>
          <h1 class="text-headline-small">{{ title }}</h1>
          <p v-if="subtitle" class="hub-main__subtitle text-body-large on-surface-variant">{{ subtitle }}</p>
        </div>
        <div class="hub-main__actions"><slot v-if="ready && allowed" name="actions" /></div>
      </header>
      <template v-if="!ready">
        <v-skeleton-loader type="card" class="mb-4 rounded-xl" height="160" />
        <v-skeleton-loader type="card" class="rounded-xl" height="160" />
      </template>
      <v-card v-else-if="!allowed">
        <EmptyState
          icon="$lock"
          heading="Only the hub's owner can open this page."
          body="Your own account settings are always open to you."
        >
          <v-btn variant="tonal" :to="accountPage" class="mt-2">Open your account</v-btn>
        </EmptyState>
      </v-card>
      <slot v-else />
    </v-container>
  </v-main>

  <v-bottom-navigation v-if="showTabs && !mdAndUp" grow bg-color="surface-container" :elevation="0" :height="80">
    <v-btn v-for="tab in tabs" :key="tab.to" :to="tab.to" :value="tab.to">
      <v-icon :icon="tab.icon" />
      <span class="text-label-medium">{{ tab.shortLabel }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<style scoped>
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
  min-width: 0;
}
.hub-bar__tabs {
  display: flex;
  gap: 4px;
  margin-left: 32px;
}
/* Vuetify has a text class for no on-* role, so the colour of a text tab is set here. */
.hub-bar__tab.v-btn--variant-text {
  color: rgb(var(--v-theme-on-surface-variant));
}
.hub-main {
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
.hub-main__subtitle {
  margin-top: 6px;
}
@media (max-width: 599px) {
  .hub-main__container {
    padding-top: 20px;
  }
  .hub-main__header {
    margin-bottom: 16px;
  }
}
</style>
