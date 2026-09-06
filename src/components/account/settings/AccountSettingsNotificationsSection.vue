<script setup>
const props = defineProps({
  runtime: {
    type: Object,
    required: true
  }
});

const notifications = props.runtime.notifications;
</script>

<template>
  <v-sheet rounded="lg" border>
    <header class="pa-4 pb-0">
      <h2 class="text-h6 mb-0">Notifications</h2>
    </header>
    <div class="pa-4">
      <v-form @submit.prevent="notifications.submit" novalidate>
        <v-switch
          v-model="notifications.form.productUpdates"
          label="Product updates"
          color="primary"
          hide-details
          :disabled="notifications.isSaving.value || notifications.isRefreshing.value"
          class="mb-2"
        />
        <v-switch
          v-model="notifications.form.accountActivity"
          label="Account activity alerts"
          color="primary"
          hide-details
          :disabled="notifications.isSaving.value || notifications.isRefreshing.value"
          class="mb-2"
        />
        <v-switch
          v-model="notifications.form.securityAlerts"
          label="Security alerts (required)"
          color="primary"
          hide-details
          disabled
          class="mb-4"
        />
        <v-btn
          type="submit"
          color="primary"
          size="large"
          :disabled="notifications.isSaving.value || notifications.isRefreshing.value"
        >
          {{ notifications.isSaving.value ? "Saving notification settings…" : "Save notification settings" }}
        </v-btn>
      </v-form>
    </div>
  </v-sheet>
</template>
