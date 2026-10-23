<script setup>
import { mdiCheckDecagram, mdiEmailAlertOutline, mdiGoogle, mdiLaptop } from "@mdi/js";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import ConfirmDialog from "../../components/hub/ConfirmDialog.vue";
import HubAppLayout from "../../components/hub/HubAppLayout.vue";
import PasswordField from "../../components/hub/PasswordField.vue";
import SettingsSection from "../../components/hub/SettingsSection.vue";
import { hubRequest } from "../../lib/hubApi.js";
import { deviceName, timeAgo } from "../../lib/format.js";
import { useHubSession } from "../../lib/useHubSession.js";

const GOOGLE_NOTES = {
  linked: { type: "success", text: "Google is connected. You can now sign in with it." },
  taken: { type: "error", text: "That Google account is already connected to another account." },
  unverified: { type: "warning", text: "Confirm your email first, then connect Google." }
};

const route = useRoute();
const router = useRouter();
const { setSession } = useHubSession();
const data = ref(null);
const name = ref("");
const notice = ref(GOOGLE_NOTES[route.query.google] || null);
const busy = ref("");
const errors = ref({});
const currentPassword = ref("");
const newPassword = ref("");
const confirmEverywhere = ref(false);

const account = computed(() => data.value?.account);
const nameChanged = computed(() => account.value && name.value.trim() && name.value.trim() !== account.value.displayName);
const methodLabel = { password: "Password", google: "Google", recovery: "Password reset", preview: "Preview" };

async function load() {
  data.value = await hubRequest("/hub/api/account");
  name.value = data.value.account.displayName;
  setSession({ account: data.value.account, isOwner: data.value.isOwner });
}

onMounted(() => load().catch(() => {}));

async function act(key, work, success) {
  busy.value = key;
  errors.value = { ...errors.value, [key]: "" };
  try {
    await work();
    if (success) notice.value = { type: "success", text: success };
  } catch (problem) {
    errors.value = { ...errors.value, [key]: problem.message };
  } finally {
    busy.value = "";
  }
}

const saveName = () => act("name", async () => {
  await hubRequest("/hub/api/account", { method: "PATCH", body: { displayName: name.value } });
  await load();
}, "Your name is saved. Apps show it the next time you sign in.");

const resend = () => act("email", () => hubRequest("/hub/api/email/resend", { method: "POST", body: {} }),
  "A confirmation email is on its way.");

const savePassword = () => act("password", async () => {
  await hubRequest("/hub/api/account/password", {
    method: "POST",
    body: { currentPassword: currentPassword.value, newPassword: newPassword.value }
  });
  currentPassword.value = "";
  newPassword.value = "";
  await load();
}, "Your new password is saved.");

const disconnectGoogle = () => act("google", async () => {
  await hubRequest("/hub/api/account/google/unlink", { method: "POST", body: {} });
  await load();
}, "Google is disconnected.");

const endSession = (id) => act(`session:${id}`, async () => {
  await hubRequest(`/hub/api/account/sessions/${encodeURIComponent(id)}`, { method: "DELETE" });
  await load();
});

const signOutEverywhere = () => act("everywhere", async () => {
  await hubRequest("/hub/api/account/sign-out-everywhere", { method: "POST", body: {} });
  setSession();
  await router.replace("/auth/sign-in");
});
</script>

<template>
  <HubAppLayout title="Your account" subtitle="The one account you use for every app connected to this hub.">
    <template v-if="!data">
      <v-skeleton-loader type="card" class="mb-4 rounded-xl" height="180" />
      <v-skeleton-loader type="card" class="rounded-xl" height="180" />
    </template>
    <template v-else>
      <v-alert
        v-if="notice"
        :type="notice.type"
        variant="tonal"
        closable
        class="mb-2"
        @click:close="notice = null"
      >
        {{ notice.text }}
      </v-alert>

      <SettingsSection title="Profile" body="Apps show this name and email after you sign in.">
        <form class="field-row" @submit.prevent="saveName">
          <v-text-field v-model="name" label="Name" autocomplete="name" hide-details="auto" :error-messages="errors.name" />
          <v-btn type="submit" color="primary" variant="tonal" size="large" :disabled="!nameChanged" :loading="busy === 'name'">Save</v-btn>
        </form>
        <v-divider class="my-5" />
        <div class="email-row">
          <div class="min-w-0">
            <div class="text-body-2 text-medium-emphasis">Email</div>
            <div class="text-body-1 font-weight-medium text-truncate">{{ account.email }}</div>
          </div>
          <v-chip v-if="account.emailVerified" color="success" variant="tonal" :prepend-icon="mdiCheckDecagram">Confirmed</v-chip>
          <v-chip v-else color="warning" variant="tonal" :prepend-icon="mdiEmailAlertOutline">Not confirmed</v-chip>
        </div>
        <div v-if="!account.emailVerified" class="mt-4">
          <p class="text-body-2 text-medium-emphasis mb-3">Confirm your email to sign in to apps and to recover your password.</p>
          <v-btn variant="tonal" :loading="busy === 'email'" @click="resend">Send confirmation email</v-btn>
          <p v-if="errors.email" class="text-error text-body-2 mt-2">{{ errors.email }}</p>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Password"
        :body="account.hasPassword ? 'Change it any time. Your apps stay signed in.' : 'You sign in with Google. Add a password to sign in without it.'"
      >
        <form @submit.prevent="savePassword">
          <PasswordField v-if="account.hasPassword" v-model="currentPassword" label="Current password" />
          <PasswordField
            v-model="newPassword"
            :label="account.hasPassword ? 'New password' : 'Password'"
            autocomplete="new-password"
            hint="At least 8 characters, and not a common password."
            persistent-hint
            :error-messages="errors.password"
          />
          <div class="d-flex justify-end mt-4">
            <v-btn
              type="submit"
              color="primary"
              variant="flat"
              :disabled="!newPassword || (account.hasPassword && !currentPassword)"
              :loading="busy === 'password'"
            >
              {{ account.hasPassword ? "Change password" : "Add password" }}
            </v-btn>
          </div>
        </form>
      </SettingsSection>

      <SettingsSection v-if="data.google" title="Google" body="Sign in with your Google account instead of a password.">
        <div class="email-row">
          <div class="d-flex align-center ga-3 min-w-0">
            <v-avatar size="40" color="surface-variant"><v-icon :icon="mdiGoogle" /></v-avatar>
            <div class="min-w-0">
              <div class="font-weight-medium">{{ account.googleLinked ? "Connected" : "Not connected" }}</div>
              <div class="text-body-2 text-medium-emphasis">
                {{ account.googleLinked ? "Continue with Google signs you in." : "Connect it once to use it from now on." }}
              </div>
            </div>
          </div>
          <v-tooltip v-if="account.googleLinked" :disabled="account.hasPassword" text="Add a password first, so you can still sign in." location="top">
            <template #activator="{ props: tip }">
              <span v-bind="tip">
                <v-btn variant="text" color="error" :disabled="!account.hasPassword" :loading="busy === 'google'" @click="disconnectGoogle">Disconnect</v-btn>
              </span>
            </template>
          </v-tooltip>
          <v-tooltip v-else :disabled="account.emailVerified" text="Confirm your email first." location="top">
            <template #activator="{ props: tip }">
              <span v-bind="tip">
                <v-btn variant="tonal" :disabled="!account.emailVerified" href="/hub/google/start?intent=link">Connect Google</v-btn>
              </span>
            </template>
          </v-tooltip>
        </div>
        <p v-if="!account.googleLinked && !account.emailVerified" class="text-body-2 text-medium-emphasis mt-3 d-sm-none">
          Confirm your email first, then connect Google.
        </p>
        <p v-if="account.googleLinked && !account.hasPassword" class="text-body-2 text-medium-emphasis mt-3 d-sm-none">
          Add a password first, so you can still sign in without Google.
        </p>
        <p v-if="errors.google" class="text-error text-body-2 mt-2">{{ errors.google }}</p>
      </SettingsSection>

      <SettingsSection title="Where you're signed in" body="Signing out here also signs you out of the apps on that device the next time they check.">
        <v-list class="py-0" bg-color="transparent">
          <v-list-item v-for="item in data.sessions" :key="item.id" class="px-0 session-row">
            <template #prepend>
              <v-avatar size="40" color="surface-variant" class="mr-3"><v-icon :icon="mdiLaptop" /></v-avatar>
            </template>
            <v-list-item-title class="font-weight-medium">
              {{ deviceName(item.userAgent) }}
              <v-chip v-if="item.current" size="x-small" color="primary" variant="tonal" class="ml-2">This device</v-chip>
            </v-list-item-title>
            <v-list-item-subtitle>{{ methodLabel[item.method] || "Password" }} · {{ timeAgo(item.createdAt) }}</v-list-item-subtitle>
            <template #append>
              <v-btn
                v-if="!item.current"
                variant="text"
                size="small"
                :loading="busy === `session:${item.id}`"
                @click="endSession(item.id)"
              >
                Sign out
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
        <v-divider class="my-3" />
        <div class="d-flex justify-end">
          <v-btn variant="tonal" color="error" @click="confirmEverywhere = true">Sign out everywhere</v-btn>
        </div>
      </SettingsSection>

      <ConfirmDialog
        v-model="confirmEverywhere"
        title="Sign out everywhere?"
        body="Every device and every connected app signs you out. You'll sign in again on this device."
        confirm-label="Sign out everywhere"
        confirm-color="error"
        :busy="busy === 'everywhere'"
        :error="errors.everywhere"
        @confirm="signOutEverywhere"
      />
    </template>
  </HubAppLayout>
</template>

<style scoped>
.field-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.email-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.min-w-0 {
  min-width: 0;
}
.session-row + .session-row {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
</style>
