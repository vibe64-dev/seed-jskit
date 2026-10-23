<script setup>
import { mdiCheckDecagramOutline, mdiLinkVariantOff } from "@mdi/js";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import HubAuthLayout from "../../components/hub/HubAuthLayout.vue";
import { hubRequest } from "../../lib/hubApi.js";

const route = useRoute();
const view = ref("confirming");
const email = ref("");

onMounted(async () => {
  try {
    const { account } = await hubRequest("/hub/api/email/confirm", { method: "POST", body: { token: route.query.token } });
    email.value = account.email;
    view.value = "done";
  } catch {
    view.value = "expired";
  }
});
</script>

<template>
  <HubAuthLayout>
    <div v-if="view === 'confirming'" class="state-min" aria-busy="true">
      <v-skeleton-loader type="avatar, heading, text, button" />
    </div>
    <div v-else-if="view === 'done'" class="state-min text-center">
      <v-avatar size="64" color="success" variant="tonal" class="mb-4 mx-auto"><v-icon :icon="mdiCheckDecagramOutline" size="30" /></v-avatar>
      <h1 class="auth-title">Your email is confirmed.</h1>
      <p class="auth-lead">Your apps now know {{ email }} is really yours.</p>
      <v-btn color="primary" variant="flat" size="large" block to="/account">Open your account</v-btn>
    </div>
    <div v-else class="state-min text-center">
      <v-avatar size="64" color="primary" variant="tonal" class="mb-4 mx-auto"><v-icon :icon="mdiLinkVariantOff" size="30" /></v-avatar>
      <h1 class="auth-title">This link has expired.</h1>
      <p class="auth-lead">Sign in and send a new confirmation email from your account.</p>
      <v-btn color="primary" variant="flat" size="large" block to="/account">Open your account</v-btn>
    </div>
  </HubAuthLayout>
</template>

<style scoped src="../../components/hub/auth.css"></style>
