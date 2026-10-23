<script setup>
import { mdiLinkVariantOff } from "@mdi/js";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import HubAuthLayout from "../../components/hub/HubAuthLayout.vue";
import PasswordField from "../../components/hub/PasswordField.vue";
import { hubRequest } from "../../lib/hubApi.js";
import { useHubSession } from "../../lib/useHubSession.js";

const route = useRoute();
const router = useRouter();
const { setSession } = useHubSession();
const password = ref("");
const busy = ref(false);
const error = ref("");
const expired = ref(!route.query.token);

async function save() {
  busy.value = true;
  error.value = "";
  try {
    const result = await hubRequest("/hub/api/recovery/finish", {
      method: "POST",
      body: { token: route.query.token, password: password.value }
    });
    setSession(result);
    await router.replace("/account");
  } catch (problem) {
    if (problem.status === 410) expired.value = true;
    else error.value = problem.message;
    busy.value = false;
  }
}
</script>

<template>
  <HubAuthLayout>
    <div v-if="expired" class="state-min text-center">
      <v-avatar size="64" color="primary" variant="tonal" class="mb-4 mx-auto"><v-icon :icon="mdiLinkVariantOff" size="30" /></v-avatar>
      <h1 class="auth-title">This link has expired.</h1>
      <p class="auth-lead">Reset links work once, for one hour. Ask for a new one.</p>
      <v-btn color="primary" variant="flat" size="large" block to="/auth/forgot-password">Send a new link</v-btn>
    </div>
    <form v-else class="state-min" novalidate @submit.prevent="save">
      <h1 class="auth-title">Choose a new password</h1>
      <p class="auth-lead">You'll be signed in on this device, and signed out everywhere else.</p>
      <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4" role="alert">{{ error }}</v-alert>
      <PasswordField
        v-model="password"
        label="New password"
        autocomplete="new-password"
        hint="At least 8 characters, and not a common password."
        persistent-hint
        autofocus
      />
      <v-btn type="submit" color="primary" variant="flat" size="large" block class="mt-4" :loading="busy">Save and sign in</v-btn>
    </form>
  </HubAuthLayout>
</template>

<style scoped src="../../components/hub/auth.css"></style>
