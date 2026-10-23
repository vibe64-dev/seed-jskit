<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import GoogleButton from "../../components/hub/GoogleButton.vue";
import HubAuthLayout from "../../components/hub/HubAuthLayout.vue";
import PasswordField from "../../components/hub/PasswordField.vue";
import { hubRequest } from "../../lib/hubApi.js";
import { useHubSession } from "../../lib/useHubSession.js";
import { useSignInFlow } from "../../lib/useSignInFlow.js";

const { session, refreshSession, setSession } = useHubSession();
const { interaction, withFlow, finish, googleHref } = useSignInFlow();
const router = useRouter();
const displayName = ref("");
const email = ref("");
const password = ref("");
const busy = ref(false);
const error = ref("");

refreshSession().catch(() => {});

async function create() {
  busy.value = true;
  error.value = "";
  try {
    const result = await hubRequest("/hub/api/accounts", {
      method: "POST",
      body: { displayName: displayName.value, email: email.value, password: password.value }
    });
    setSession(result);
    await finish();
  } catch (problem) {
    // A new account confirms its email before an app sign-in continues; the
    // sign-in page shows that step.
    if (problem.code === "email_unconfirmed" && interaction.value) {
      await router.replace(withFlow("/auth/sign-in"));
      return;
    }
    error.value = problem.message;
    busy.value = false;
  }
}
</script>

<template>
  <HubAuthLayout>
    <form class="state-min" novalidate @submit.prevent="create">
      <h1 class="auth-title">Create your account</h1>
      <p class="auth-lead">One account for every app connected to this hub.</p>
      <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mb-4" role="alert">{{ error }}</v-alert>
      <v-text-field v-model="displayName" label="Your name" autocomplete="name" autofocus />
      <v-text-field v-model="email" label="Email" type="email" autocomplete="email" inputmode="email" />
      <PasswordField
        v-model="password"
        label="Choose a password"
        autocomplete="new-password"
        hint="At least 8 characters, and not a common password."
        persistent-hint
      />
      <v-btn type="submit" color="primary" variant="flat" size="large" block class="mt-4" :loading="busy">Create account</v-btn>
      <template v-if="session.google">
        <div class="or-divider"><span>or</span></div>
        <GoogleButton :href="googleHref()" label="Sign up with Google" />
      </template>
      <p class="auth-switch">
        Already have an account?
        <router-link class="auth-link" :to="withFlow('/auth/sign-in')">Sign in</router-link>
      </p>
    </form>
  </HubAuthLayout>
</template>

<style scoped src="../../components/hub/auth.css"></style>
