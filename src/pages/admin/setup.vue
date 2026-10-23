<script setup>
import { mdiAlertCircle, mdiCheckCircle, mdiCircleOutline, mdiContentCopy } from "@mdi/js";
import { computed, onMounted, ref } from "vue";
import HubAppLayout from "../../components/hub/HubAppLayout.vue";
import { hubRequest } from "../../lib/hubApi.js";
import { timeAgo } from "../../lib/format.js";

const data = ref(null);
const loadError = ref("");
const busy = ref("");
const errors = ref({});
const copied = ref(false);

const STATE_ICONS = {
  ok: { icon: mdiCheckCircle, color: "success", label: "Ready" },
  warning: { icon: mdiAlertCircle, color: "warning", label: "Needs attention" },
  todo: { icon: mdiCircleOutline, color: "medium-emphasis", label: "Not done yet" }
};

const items = computed(() => {
  if (!data.value) return [];
  const byId = Object.fromEntries(data.value.items.map((item) => [item.id, item]));
  const { issuer, ownerEmail, devOriginPatterns } = data.value;
  return [
    {
      ...byId.https,
      title: "Your hub's address is https.",
      text: byId.https.state === "ok" ? issuer : "Set APP_PUBLIC_URL to your hub's https address before you deploy it.",
      variable: byId.https.state === "ok" ? "" : "APP_PUBLIC_URL"
    },
    {
      ...byId.domain,
      title: "Your hub has a domain of its own.",
      text: "Use a domain no other app shares, so other apps can't plant cookies on it."
    },
    {
      ...byId.secret,
      title: "A hub secret is set.",
      text: byId.secret.state === "ok"
        ? "It protects sign-in cookies and the stored signing keys."
        : "This copy uses a generated development secret. Set OIDC_HUB_SECRET to at least 32 random bytes in your host's secret store.",
      variable: byId.secret.state === "ok" ? "" : "OIDC_HUB_SECRET"
    },
    {
      ...byId["registration-token"],
      title: "A registration token is set.",
      text: "Apps present it to register. Give each app the same value as AUTH_OIDC_REGISTRATION_TOKEN."
    },
    {
      ...byId.owner,
      title: "You are the owner.",
      text: byId.owner.state === "ok" ? `${ownerEmail} is confirmed.` : `Create the account ${ownerEmail} and confirm its email.`
    },
    {
      ...byId.email,
      title: "Email works.",
      text: byId.email.state === "warning"
        ? "Set OIDC_HUB_EMAIL_FROM with RESEND_API_KEY or SMTP_URL, so confirmation and recovery emails can be sent."
        : byId.email.state === "ok"
          ? `The last test email was sent ${timeAgo(byId.email.lastTestAt)}.`
          : "Send a test email to make sure confirmation and recovery emails arrive.",
      variable: byId.email.state === "warning" ? "OIDC_HUB_EMAIL_FROM" : ""
    },
    {
      ...byId.google,
      title: "Continue with Google works (optional).",
      text: byId.google.state === "ok"
        ? "People can sign in with Google. Keep this redirect address in your Google OAuth client:"
        : "Create an OAuth client in your Google Cloud console, add this redirect address, then set OIDC_HUB_GOOGLE_CLIENT_ID and OIDC_HUB_GOOGLE_CLIENT_SECRET:"
    },
    {
      ...byId["signing-key"],
      title: "A signing key is active.",
      text: byId["signing-key"].activeSince
        ? `Active since ${new Date(byId["signing-key"].activeSince).toLocaleDateString()}. Rotate it from Apps.`
        : "The hub creates one when it starts."
    },
    {
      ...byId.development,
      title: "Development addresses.",
      text: devOriginPatterns.length
        ? `Approved automatically: this computer, and ${devOriginPatterns.join(", ")}.`
        : "Approved automatically: this computer. Add preview addresses with OIDC_HUB_DEV_ORIGIN_PATTERNS."
    }
  ];
});
const readyCount = computed(() => items.value.filter((item) => item.state === "ok").length);

async function load() {
  try {
    data.value = await hubRequest("/hub/api/admin/setup");
  } catch (problem) {
    loadError.value = problem.message;
  }
}

onMounted(load);

async function act(id, work) {
  busy.value = id;
  errors.value = { ...errors.value, [id]: "" };
  try {
    await work();
    await load();
  } catch (problem) {
    errors.value = { ...errors.value, [id]: problem.message };
  } finally {
    busy.value = "";
  }
}

const sendTestEmail = () => act("email", () => hubRequest("/hub/api/admin/setup/test-email", { method: "POST", body: {} }));
const setDomain = (confirmed) => act("domain", () => hubRequest("/hub/api/admin/setup/domain", { method: "POST", body: { confirmed } }));

async function copyRedirect() {
  await navigator.clipboard?.writeText(data.value.googleRedirectUri);
  copied.value = true;
}
</script>

<template>
  <HubAppLayout title="Setup" subtitle="What your hub needs before your apps rely on it." owner-only>
    <v-alert v-if="loadError" type="error" variant="tonal" class="mb-4">{{ loadError }}</v-alert>
    <v-snackbar v-model="copied" :timeout="2500" color="inverse-surface">Redirect address copied.</v-snackbar>
    <v-skeleton-loader v-if="!data && !loadError" type="list-item-two-line@6" class="rounded-xl" />

    <template v-else-if="data">
      <v-card border flat class="progress-card mb-4">
        <div class="d-flex align-center justify-space-between mb-2">
          <span class="font-weight-medium">{{ readyCount }} of {{ items.length }} ready</span>
          <span class="text-body-2 text-medium-emphasis">{{ data.issuer }}</span>
        </div>
        <v-progress-linear :model-value="(readyCount / items.length) * 100" color="success" rounded height="8" bg-opacity="0.12" />
      </v-card>

      <v-card border flat>
        <div v-for="item in items" :key="item.id" class="check-row" :data-state="item.state">
          <v-icon
            :icon="STATE_ICONS[item.state].icon"
            :color="STATE_ICONS[item.state].color"
            :aria-label="STATE_ICONS[item.state].label"
            class="check-row__icon"
          />
          <div class="check-row__text">
            <div class="check-row__title">{{ item.title }}</div>
            <div class="check-row__body">{{ item.text }}</div>
            <code v-if="item.variable" class="check-row__variable">{{ item.variable }}</code>
            <div v-if="item.id === 'google'" class="redirect-field">
              <code>{{ data.googleRedirectUri }}</code>
              <v-btn :icon="mdiContentCopy" variant="text" size="small" aria-label="Copy redirect address" @click="copyRedirect" />
            </div>
            <p v-if="errors[item.id]" class="text-error text-body-2 mt-2">{{ errors[item.id] }}</p>
          </div>
          <div class="check-row__action">
            <v-btn
              v-if="item.id === 'email' && item.state !== 'warning'"
              variant="tonal"
              :loading="busy === 'email'"
              @click="sendTestEmail"
            >
              {{ item.state === "ok" ? "Send again" : "Send a test email" }}
            </v-btn>
            <v-btn v-if="item.id === 'domain' && item.state !== 'ok'" variant="tonal" :loading="busy === 'domain'" @click="setDomain(true)">
              It has one
            </v-btn>
            <v-btn v-if="item.id === 'domain' && item.state === 'ok'" variant="text" :loading="busy === 'domain'" @click="setDomain(false)">
              Undo
            </v-btn>
            <v-btn v-if="item.id === 'signing-key'" variant="text" to="/admin/apps">Open Apps</v-btn>
          </div>
        </div>
      </v-card>
    </template>
  </HubAppLayout>
</template>

<style scoped>
.progress-card {
  padding: 18px 20px;
}
.check-row {
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) auto;
  gap: 16px;
  align-items: start;
  padding: 18px 20px;
}
.check-row + .check-row {
  border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}
.check-row__icon {
  margin-top: 1px;
}
.check-row__title {
  font-weight: 600;
}
.check-row__body {
  margin-top: 2px;
  font-size: 0.9rem;
  color: rgba(var(--v-theme-on-surface), 0.68);
  overflow-wrap: anywhere;
}
.check-row__variable,
.redirect-field code {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.82rem;
}
.check-row__variable {
  display: inline-block;
  margin-top: 8px;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgba(var(--v-theme-on-surface), 0.06);
}
.redirect-field {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  padding: 4px 4px 4px 12px;
  border-radius: 10px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  max-width: 100%;
}
.redirect-field code {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}
@media (max-width: 599px) {
  .check-row {
    grid-template-columns: 24px minmax(0, 1fr);
    padding: 16px;
  }
  .check-row__action {
    grid-column: 2;
  }
}
</style>
