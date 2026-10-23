<script setup>
import { mdiEmailFastOutline, mdiLinkVariantOff } from "@mdi/js";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import HubAuthLayout from "../../components/hub/HubAuthLayout.vue";
import PasswordField from "../../components/hub/PasswordField.vue";
import { hubRequest } from "../../lib/hubApi.js";
import { useHubSession } from "../../lib/useHubSession.js";

const route = useRoute();
const router = useRouter();
const { setSession } = useHubSession();
const token = typeof route.query.token === "string" ? route.query.token : "";
const view = ref(token ? "choose" : "loading");
const email = ref("");
const hasPassword = ref(false);
const password = ref("");
const busy = ref(false);
const error = ref("");

onMounted(async () => {
  if (token) return;
  try {
    const pending = await hubRequest("/hub/api/google/link");
    email.value = pending.email;
    hasPassword.value = pending.hasPassword;
    view.value = "prove";
  } catch {
    view.value = "expired";
  }
});

async function run(work) {
  busy.value = true;
  error.value = "";
  try {
    await work();
  } catch (problem) {
    if (problem.status === 410) view.value = "expired";
    else error.value = problem.message;
  } finally {
    busy.value = false;
  }
}

const withPassword = () => run(async () => {
  const { redirectTo } = await hubRequest("/hub/api/google/link/password", { method: "POST", body: { password: password.value } });
  window.location.assign(redirectTo);
});

const byEmail = () => run(async () => {
  await hubRequest("/hub/api/google/link/email", { method: "POST", body: {} });
  view.value = "sent";
});

const finishFromEmail = () => run(async () => {
  const result = await hubRequest("/hub/api/google/link/finish", { method: "POST", body: { token, password: password.value } });
  setSession(result);
  await router.replace("/account");
});
</script>

<template>
  <HubAuthLayout>
    <div v-if="view === 'loading'" class="state-min" aria-busy="true">
      <v-skeleton-loader type="heading, text, text, button" />
    </div>

    <div v-else-if="view === 'expired'" class="state-min text-center">
      <v-avatar size="64" color="primary" variant="tonal" class="mb-4 mx-auto"><v-icon :icon="mdiLinkVariantOff" size="30" /></v-avatar>
      <h1 class="auth-title">This connection has expired.</h1>
      <p class="auth-lead">Continue with Google again from the sign-in page.</p>
      <v-btn color="primary" variant="flat" size="large" block to="/auth/sign-in">Back to sign in</v-btn>
    </div>

    <div v-else-if="view === 'sent'" class="state-min text-center">
      <v-avatar size="64" color="primary" variant="tonal" class="mb-4 mx-auto"><v-icon :icon="mdiEmailFastOutline" size="30" /></v-avatar>
      <h1 class="auth-title">Check your email</h1>
      <p class="auth-lead">Open the link we sent to {{ email }} to connect Google. It works for one hour.</p>
    </div>

    <form v-else-if="view === 'prove'" class="state-min" novalidate @submit.prevent="withPassword">
      <h1 class="auth-title">Connect Google to your account</h1>
      <p class="auth-lead">
        {{ email }} already has an account here.
        {{ hasPassword ? "Sign in with your password once to connect Google." : "Confirm by email once to connect Google." }}
      </p>
      <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4" role="alert">{{ error }}</v-alert>
      <template v-if="hasPassword">
        <PasswordField v-model="password" autofocus />
        <v-btn type="submit" color="primary" variant="flat" size="large" block :loading="busy">Connect and sign in</v-btn>
        <v-btn variant="text" size="large" block class="mt-2" :disabled="busy" @click="byEmail">Email me a link instead</v-btn>
      </template>
      <v-btn v-else color="primary" variant="flat" size="large" block :loading="busy" @click="byEmail">Email me a link</v-btn>
    </form>

    <form v-else class="state-min" novalidate @submit.prevent="finishFromEmail">
      <h1 class="auth-title">Choose a new password</h1>
      <p class="auth-lead">Google will be connected, and this new password replaces the old one.</p>
      <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4" role="alert">{{ error }}</v-alert>
      <PasswordField
        v-model="password"
        label="New password"
        autocomplete="new-password"
        hint="At least 8 characters, and not a common password."
        persistent-hint
        autofocus
      />
      <v-btn type="submit" color="primary" variant="flat" size="large" block class="mt-4" :loading="busy">Connect Google and sign in</v-btn>
    </form>
  </HubAuthLayout>
</template>

<style scoped src="../../components/hub/auth.css"></style>
