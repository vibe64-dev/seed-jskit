<script setup>
import { mdiCompassOffOutline } from "@mdi/js";
import EmptyState from "../components/hub/EmptyState.vue";
import HubAuthLayout from "../components/hub/HubAuthLayout.vue";
</script>

<template>
  <HubAuthLayout>
    <EmptyState :icon="mdiCompassOffOutline" heading="This page does not exist." body="Check the address, or open your account.">
      <v-btn color="primary" variant="flat" to="/account" class="mt-2">Open your account</v-btn>
    </EmptyState>
  </HubAuthLayout>
</template>
