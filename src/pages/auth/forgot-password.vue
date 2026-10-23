<script setup>
import { mdiEmailFastOutline } from "@mdi/js";
import { ref } from "vue";
import HubAuthLayout from "../../components/hub/HubAuthLayout.vue";
import { hubRequest } from "../../lib/hubApi.js";
import { useSignInFlow } from "../../lib/useSignInFlow.js";

const { withFlow } = useSignInFlow();
const email = ref("");
const sent = ref(false);
const busy = ref(false);
const error = ref("");

async function send() {
  busy.value = true;
  error.value = "";
  try {
    await hubRequest("/hub/api/recovery/start", { method: "POST", body: { email: email.value } });
    sent.value = true;
  } catch (problem) {
    error.value = problem.message;
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <HubAuthLayout>
    <div v-if="sent" class="state-min text-center">
      <v-avatar size="64" color="primary" variant="tonal" class="mb-4 mx-auto"><v-icon :icon="mdiEmailFastOutline" size="30" /></v-avatar>
      <h1 class="auth-title">Check your email</h1>
      <p class="auth-lead">If an account uses {{ email }}, a link to choose a new password is on its way. It works for one hour.</p>
      <v-btn variant="tonal" size="large" block :to="withFlow('/auth/sign-in')">Back to sign in</v-btn>
    </div>
    <form v-else class="state-min" novalidate @submit.prevent="send">
      <h1 class="auth-title">Reset your password</h1>
      <p class="auth-lead">We'll email you a link to choose a new one.</p>
      <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4" role="alert">{{ error }}</v-alert>
      <v-text-field v-model="email" label="Email" type="email" autocomplete="email" inputmode="email" autofocus />
      <v-btn type="submit" color="primary" variant="flat" size="large" block :loading="busy">Send link</v-btn>
      <p class="auth-switch">
        Remembered it?
        <router-link class="auth-link" :to="withFlow('/auth/sign-in')">Sign in</router-link>
      </p>
    </form>
  </HubAuthLayout>
</template>

<style scoped src="../../components/hub/auth.css"></style>
