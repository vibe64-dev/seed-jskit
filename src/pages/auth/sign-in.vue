<script setup>
import { mdiClockOutline, mdiLinkVariantOff } from "@mdi/js";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import AppAvatar from "../../components/hub/AppAvatar.vue";
import GoogleButton from "../../components/hub/GoogleButton.vue";
import HubAuthLayout from "../../components/hub/HubAuthLayout.vue";
import PasswordField from "../../components/hub/PasswordField.vue";
import { hubRequest } from "../../lib/hubApi.js";
import { hostOf, initials } from "../../lib/format.js";
import { useHubSession } from "../../lib/useHubSession.js";
import { useSignInFlow } from "../../lib/useSignInFlow.js";

const GOOGLE_MESSAGES = {
  failed: "Google sign-in did not finish. Try again, or use your email and password.",
  unverified: "Google has not confirmed that email address, so it cannot be used here."
};

const route = useRoute();
const { session, refreshSession, setSession } = useHubSession();
const { interaction, withFlow, finish, googleHref } = useSignInFlow();

const view = ref("loading");
const app = ref(null);
const email = ref("");
const password = ref("");
const busy = ref(false);
const error = ref(GOOGLE_MESSAGES[route.query.google] || "");

const heading = computed(() => (app.value ? `Sign in to continue to ${app.value.name}` : "Sign in"));

onMounted(async () => {
  try {
    if (interaction.value) {
      const details = await hubRequest(`/hub/interaction/${encodeURIComponent(interaction.value)}/details`);
      app.value = details.app;
      setSession({ account: details.account, isOwner: session.isOwner });
      session.google = details.google;
      if (details.app?.status === "pending") view.value = "pending";
      else view.value = details.account ? "continue" : "form";
      return;
    }
    await refreshSession();
    if (session.account) {
      await finish();
      return;
    }
    view.value = "form";
  } catch (problem) {
    if (interaction.value && problem.status === 404) view.value = "expired";
    else {
      error.value = problem.message;
      view.value = "form";
    }
  }
});

async function run(work) {
  busy.value = true;
  error.value = "";
  try {
    await work();
  } catch (problem) {
    if (problem.code === "app_pending") view.value = "pending";
    else error.value = problem.message;
    busy.value = false;
  }
}

function signIn() {
  return run(async () => {
    const result = await hubRequest("/hub/api/sign-in", { method: "POST", body: { email: email.value, password: password.value } });
    setSession(result);
    await finish();
  });
}

function continueAs() {
  return run(finish);
}

function useAnother() {
  view.value = "form";
}

function backToApp() {
  return run(async () => {
    const { redirectTo } = await hubRequest(`/hub/interaction/${encodeURIComponent(interaction.value)}/cancel`, { method: "POST", body: {} });
    window.location.assign(redirectTo);
  });
}
</script>

<template>
  <HubAuthLayout>
    <div v-if="view === 'loading'" class="state-min" aria-busy="true">
      <v-skeleton-loader type="heading, text, text, button" />
    </div>

    <div v-else-if="view === 'expired'" class="state-min text-center">
      <v-avatar size="64" color="primary" variant="tonal" class="mb-4"><v-icon :icon="mdiLinkVariantOff" size="30" /></v-avatar>
      <h1 class="auth-title">This sign-in has expired.</h1>
      <p class="auth-lead">Go back to the app and sign in again.</p>
    </div>

    <div v-else-if="view === 'pending'" class="state-min">
      <div class="text-center">
        <v-avatar size="64" color="warning" variant="tonal" class="mb-4"><v-icon :icon="mdiClockOutline" size="30" /></v-avatar>
        <h1 class="auth-title">This app is waiting for approval by the hub's owner.</h1>
        <p class="auth-lead">The owner approves each new app once. Try again after they have.</p>
      </div>
      <div v-if="app" class="app-chip">
        <AppAvatar :name="app.name" :size="40" />
        <div class="min-w-0">
          <div class="font-weight-medium text-truncate">{{ app.name }}</div>
          <div class="text-body-2 text-medium-emphasis app-chip__origin">{{ app.origin }}</div>
        </div>
      </div>
      <v-btn variant="tonal" size="large" block :loading="busy" @click="backToApp">Back to the app</v-btn>
    </div>

    <div v-else-if="view === 'continue'" class="state-min">
      <h1 class="auth-title">{{ heading }}</h1>
      <p v-if="app" class="auth-lead">{{ hostOf(app.origin) }}</p>
      <div class="account-row">
        <v-avatar size="44" color="primary" variant="tonal">
          <span class="font-weight-bold">{{ initials(session.account.displayName) }}</span>
        </v-avatar>
        <div class="min-w-0">
          <div class="font-weight-medium text-truncate">{{ session.account.displayName }}</div>
          <div class="text-body-2 text-medium-emphasis text-truncate">{{ session.account.email }}</div>
        </div>
      </div>
      <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4">{{ error }}</v-alert>
      <v-btn color="primary" variant="flat" size="large" block :loading="busy" @click="continueAs">Continue</v-btn>
      <v-btn variant="text" size="large" block class="mt-2" :disabled="busy" @click="useAnother">Use another account</v-btn>
    </div>

    <form v-else class="state-min" novalidate @submit.prevent="signIn">
      <h1 class="auth-title">{{ heading }}</h1>
      <p class="auth-lead">{{ app ? hostOf(app.origin) : "Use your account for every connected app." }}</p>
      <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4" role="alert">{{ error }}</v-alert>
      <v-text-field v-model="email" label="Email" type="email" autocomplete="username" inputmode="email" autofocus />
      <PasswordField v-model="password" />
      <div class="d-flex justify-end mt-n2 mb-4">
        <router-link class="auth-link text-body-2" :to="withFlow('/auth/forgot-password')">Forgot password?</router-link>
      </div>
      <v-btn type="submit" color="primary" variant="flat" size="large" block :loading="busy">Sign in</v-btn>
      <template v-if="session.google">
        <div class="or-divider"><span>or</span></div>
        <GoogleButton :href="googleHref()" />
      </template>
      <p class="auth-switch">
        New here?
        <router-link class="auth-link" :to="withFlow('/auth/create-account')">Create an account</router-link>
      </p>
    </form>
  </HubAuthLayout>
</template>

<style scoped src="../../components/hub/auth.css"></style>
