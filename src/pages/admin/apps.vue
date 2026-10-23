<script setup>
import { mdiApps, mdiKeyChainVariant } from "@mdi/js";
import { computed, onMounted, ref } from "vue";
import AppRow from "../../components/hub/AppRow.vue";
import ConfirmDialog from "../../components/hub/ConfirmDialog.vue";
import EmptyState from "../../components/hub/EmptyState.vue";
import HubAppLayout from "../../components/hub/HubAppLayout.vue";
import { hubRequest } from "../../lib/hubApi.js";
import { timeAgo } from "../../lib/format.js";
import { useConfirmedAction } from "../../lib/useConfirmedAction.js";

const data = ref(null);
const loadError = ref("");

const empty = computed(() => data.value && ["waiting", "approved", "development", "blocked"].every((group) => data.value[group].length === 0));
const activeKey = computed(() => data.value?.keys.find((key) => key.state === "active"));

const ACTIONS = {
  approve: (app) => ({
    title: `Allow ${app.name} at ${app.origin} to use your accounts?`,
    body: "People will sign in to it with their hub account. Check the address: an app chooses its own name.",
    label: "Approve",
    color: "primary",
    done: `${app.name} is approved.`
  }),
  block: (app) => ({
    title: `Block ${app.origin}?`,
    body: "Apps at this address can no longer register or sign anyone in. You can unblock it later.",
    label: "Block",
    color: "error",
    done: `${app.origin} is blocked.`
  }),
  remove: (app) => ({
    title: app.status === "blocked" ? `Unblock ${app.origin}?` : `Remove ${app.name}?`,
    body: app.status === "active-dev"
      ? "It registers again the next time it signs someone in."
      : app.status === "blocked"
        ? "Apps at this address can register again, and wait for your approval."
        : "It registers again the next time it signs someone in, and waits for your approval.",
    label: app.status === "blocked" ? "Unblock" : "Remove",
    color: app.status === "blocked" ? "primary" : "error",
    done: app.status === "blocked" ? `${app.origin} can register again.` : `${app.name} is removed.`
  }),
  rotate: () => ({
    title: "Rotate the signing key?",
    body: "Apps keep working: tokens signed in the last two hours still verify, then the old key retires.",
    label: "Rotate key",
    color: "primary",
    done: "A new signing key is active."
  })
};

async function load() {
  try {
    data.value = await hubRequest("/hub/api/admin/apps");
  } catch (problem) {
    loadError.value = problem.message;
  }
}

onMounted(load);

const { pending, busy, error: actionError, noticeOpen, notice, dialogOpen, ask: askConfirm, confirm } = useConfirmedAction(load);

function ask(action, app = null) {
  const path = action === "rotate" ? "/hub/api/admin/keys/rotate" : `/hub/api/admin/apps/${encodeURIComponent(app.clientId)}/${action}`;
  askConfirm({ ...ACTIONS[action](app), run: () => hubRequest(path, { method: "POST", body: {} }) });
}
</script>

<template>
  <HubAppLayout title="Apps" subtitle="Every app that signs people in through your hub." owner-only>
    <template #actions>
      <v-btn variant="tonal" :prepend-icon="mdiKeyChainVariant" :disabled="!data" @click="ask('rotate')">Rotate signing key</v-btn>
    </template>

    <v-alert v-if="loadError" type="error" variant="tonal" class="mb-4">{{ loadError }}</v-alert>
    <v-snackbar v-model="noticeOpen" :timeout="4000" color="inverse-surface" location="bottom">{{ notice }}</v-snackbar>

    <template v-if="!data && !loadError">
      <v-skeleton-loader type="list-item-avatar-two-line@3" class="rounded-xl" />
    </template>

    <v-card v-else-if="empty" border flat>
      <EmptyState
        :icon="mdiApps"
        heading="No app has signed in through your hub yet."
        body="Connect an app and it appears here. Development addresses are approved automatically; you approve each production address once."
      />
    </v-card>

    <template v-else-if="data">
      <section v-if="data.waiting.length" class="group">
        <h2 class="group__title">Waiting for you <span class="group__count">{{ data.waiting.length }}</span></h2>
        <v-card border flat class="group__card group__card--attention">
          <AppRow v-for="app in data.waiting" :key="app.clientId" :app="app" :meta="`Registered ${timeAgo(app.createdAt)}`">
            <v-btn color="primary" variant="flat" @click="ask('approve', app)">Approve</v-btn>
            <v-btn variant="text" color="error" @click="ask('block', app)">Block</v-btn>
          </AppRow>
        </v-card>
      </section>

      <section class="group">
        <h2 class="group__title">Approved</h2>
        <v-card border flat class="group__card">
          <AppRow
            v-for="app in data.approved"
            :key="app.clientId"
            :app="app"
            :meta="app.lastUsedAt ? `Last sign-in ${timeAgo(app.lastUsedAt)}` : `Approved ${timeAgo(app.approvedAt)}`"
          >
            <v-btn variant="text" @click="ask('remove', app)">Remove</v-btn>
          </AppRow>
          <p v-if="!data.approved.length" class="group__empty">Approved production apps appear here.</p>
        </v-card>
      </section>

      <section class="group">
        <h2 class="group__title">Development <span class="group__hint">approved automatically</span></h2>
        <v-card border flat class="group__card">
          <AppRow
            v-for="app in data.development"
            :key="app.clientId"
            :app="app"
            :meta="app.lastUsedAt ? `Last sign-in ${timeAgo(app.lastUsedAt)}` : `Registered ${timeAgo(app.createdAt)}`"
          >
            <v-btn variant="text" @click="ask('remove', app)">Remove</v-btn>
          </AppRow>
          <p v-if="!data.development.length" class="group__empty">Apps on this computer or on your development addresses appear here.</p>
        </v-card>
      </section>

      <section v-if="data.blocked.length" class="group">
        <h2 class="group__title">Blocked</h2>
        <v-card border flat class="group__card">
          <AppRow v-for="app in data.blocked" :key="app.clientId" :app="app">
            <v-btn variant="text" @click="ask('remove', app)">Unblock</v-btn>
          </AppRow>
        </v-card>
      </section>

      <p v-if="activeKey" class="key-note">
        Signing key active since {{ new Date(activeKey.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" }) }}.
      </p>
    </template>

    <ConfirmDialog
      v-model="dialogOpen"
      :title="pending?.title || ''"
      :body="pending?.body || ''"
      :confirm-label="pending?.label || ''"
      :confirm-color="pending?.color || 'primary'"
      :busy="busy"
      :error="actionError"
      @confirm="confirm"
    />
  </HubAppLayout>
</template>

<style scoped>
.group + .group {
  margin-top: 28px;
}
.group__title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 10px;
}
.group__count {
  display: inline-grid;
  place-items: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 0.8rem;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
}
.group__hint {
  font-weight: 400;
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-background), 0.6);
}
.group__card--attention {
  border-color: rgba(var(--v-theme-primary), 0.5) !important;
  background: rgba(var(--v-theme-primary), 0.04);
}
.group__empty {
  padding: 18px 20px;
  color: rgba(var(--v-theme-on-surface), 0.6);
  font-size: 0.9rem;
}
.key-note {
  margin-top: 28px;
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-background), 0.6);
}
</style>
