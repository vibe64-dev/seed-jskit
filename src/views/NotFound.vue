<script setup>
import EmptyState from "../components/hub/EmptyState.vue";
import HubAuthLayout from "../components/hub/HubAuthLayout.vue";
import { usePaths } from "@jskit-ai/shell-web/client/navigation/usePaths";

const paths = usePaths();
</script>

<template>
  <HubAuthLayout>
    <EmptyState icon="$searchOff" heading="This page does not exist." body="Check the address, or open your account.">
      <v-btn :to="paths.page('/', { surface: 'account' })" class="mt-2">Open your account</v-btn>
    </EmptyState>
  </HubAuthLayout>
</template>
