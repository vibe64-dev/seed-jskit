<script setup>
import { mdiAccountGroupOutline, mdiMagnify } from "@mdi/js";
import { computed, onMounted, ref } from "vue";
import ConfirmDialog from "../../components/hub/ConfirmDialog.vue";
import EmptyState from "../../components/hub/EmptyState.vue";
import HubAppLayout from "../../components/hub/HubAppLayout.vue";
import { hubRequest } from "../../lib/hubApi.js";
import { initials, timeAgo } from "../../lib/format.js";
import { useConfirmedAction } from "../../lib/useConfirmedAction.js";

const people = ref(null);
const loadError = ref("");
const search = ref("");

const shown = computed(() => {
  const query = search.value.trim().toLowerCase();
  return (people.value || []).filter((person) =>
    !query || person.email.includes(query) || person.displayName.toLowerCase().includes(query));
});

async function load() {
  try {
    people.value = (await hubRequest("/hub/api/admin/people")).people;
  } catch (problem) {
    loadError.value = problem.message;
  }
}

onMounted(load);

const { pending, busy, error: actionError, noticeOpen, notice, dialogOpen, ask: askConfirm, confirm } = useConfirmedAction(load);

function ask(person) {
  const action = person.disabled ? "enable" : "disable";
  const run = () => hubRequest(`/hub/api/admin/people/${encodeURIComponent(person.id)}/${action}`, { method: "POST", body: {} });
  askConfirm(person.disabled
    ? {
        run,
        title: `Turn ${person.displayName}'s account back on?`,
        body: "They can sign in to your apps again.",
        label: "Turn on",
        color: "primary",
        done: `${person.displayName} can sign in again.`
      }
    : {
        run,
        title: `Turn off ${person.displayName}'s account?`,
        body: "They are signed out of every app now and cannot sign in until you turn the account back on.",
        label: "Turn off",
        color: "error",
        done: `${person.displayName} is signed out everywhere.`
      });
}
</script>

<template>
  <HubAppLayout title="People" subtitle="Everyone with an account on your hub." owner-only>
    <v-alert v-if="loadError" type="error" variant="tonal" class="mb-4">{{ loadError }}</v-alert>
    <v-snackbar v-model="noticeOpen" :timeout="4000" color="inverse-surface">{{ notice }}</v-snackbar>

    <v-skeleton-loader v-if="!people && !loadError" type="list-item-avatar-two-line@4" class="rounded-xl" />

    <template v-else-if="people">
      <v-text-field
        v-model="search"
        :prepend-inner-icon="mdiMagnify"
        label="Find by name or email"
        hide-details
        clearable
        class="mb-4 search"
      />
      <v-card border flat>
        <div v-for="person in shown" :key="person.id" class="person-row">
          <v-avatar size="44" :color="person.disabled ? 'surface-variant' : 'primary'" variant="tonal">
            <span class="text-body-2 font-weight-bold">{{ initials(person.displayName) }}</span>
          </v-avatar>
          <div class="person-row__text">
            <div class="person-row__name">
              {{ person.displayName }}
              <v-chip v-if="person.isOwner" size="x-small" color="primary" variant="tonal">Owner</v-chip>
              <v-chip v-if="person.disabled" size="x-small" color="error" variant="tonal">Turned off</v-chip>
              <v-chip v-else-if="person.locked" size="x-small" color="warning" variant="tonal">Locked until password reset</v-chip>
              <v-chip v-if="!person.emailVerified" size="x-small" variant="tonal">Email not confirmed</v-chip>
              <v-chip v-if="person.googleLinked" size="x-small" variant="tonal">Google</v-chip>
            </div>
            <div class="person-row__meta">{{ person.email }} · joined {{ timeAgo(person.createdAt) }}</div>
          </div>
          <div class="person-row__action">
            <v-btn
              v-if="!person.isOwner"
              :color="person.disabled ? 'primary' : undefined"
              variant="text"
              @click="ask(person)"
            >
              {{ person.disabled ? "Turn on" : "Turn off" }}
            </v-btn>
          </div>
        </div>
        <EmptyState
          v-if="!shown.length"
          :icon="mdiAccountGroupOutline"
          :heading="people.length ? 'Nobody matches that search.' : 'Nobody has an account yet.'"
          :body="people.length ? 'Try part of a name or an email address.' : 'People appear here after they create an account through one of your apps.'"
        />
      </v-card>
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
.search {
  max-width: 420px;
}
.person-row {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  padding: 14px 20px;
}
.person-row + .person-row {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.person-row__name {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}
.person-row__meta {
  font-size: 0.85rem;
  color: rgba(var(--v-theme-on-surface), 0.62);
  overflow-wrap: anywhere;
}
@media (max-width: 599px) {
  .person-row {
    grid-template-columns: 44px minmax(0, 1fr);
    padding: 14px 16px;
  }
  .person-row__action {
    grid-column: 2;
    /* The text button lines up with the name above it. */
    margin-inline-start: -12px;
    margin-top: -8px;
  }
  .person-row__action:empty {
    display: none;
  }
}
</style>
