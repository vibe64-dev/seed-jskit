<script setup>
import { useDisplay } from "vuetify";

defineProps({
  title: { type: String, required: true },
  body: { type: String, default: "" },
  confirmLabel: { type: String, required: true },
  confirmColor: { type: String, default: "primary" },
  busy: { type: Boolean, default: false },
  error: { type: String, default: "" }
});
const open = defineModel({ type: Boolean, default: false });
const emit = defineEmits(["confirm"]);
const { xs } = useDisplay();
</script>

<template>
  <v-dialog v-model="open" :max-width="xs ? undefined : 460" :fullscreen="false" persistent>
    <v-card class="pa-2">
      <v-card-title class="text-h6 text-wrap pt-4">{{ title }}</v-card-title>
      <v-card-text class="text-body-1 text-medium-emphasis">
        <slot>{{ body }}</slot>
        <v-alert v-if="error" type="error" variant="tonal" density="compact" class="mt-4">{{ error }}</v-alert>
      </v-card-text>
      <v-card-actions class="px-4 pb-4">
        <v-spacer />
        <v-btn variant="text" :disabled="busy" @click="open = false">Cancel</v-btn>
        <v-btn :color="confirmColor" variant="flat" :loading="busy" @click="emit('confirm')">{{ confirmLabel }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
