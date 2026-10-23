<script setup>
import { mdiEyeOffOutline, mdiEyeOutline } from "@mdi/js";
import { ref } from "vue";

defineProps({
  label: { type: String, default: "Password" },
  autocomplete: { type: String, default: "current-password" }
});
const model = defineModel({ type: String, default: "" });
const visible = ref(false);
</script>

<template>
  <v-text-field
    v-model="model"
    :label="label"
    :type="visible ? 'text' : 'password'"
    :autocomplete="autocomplete"
    spellcheck="false"
  >
    <template #append-inner>
      <v-btn
        :icon="visible ? mdiEyeOffOutline : mdiEyeOutline"
        :aria-label="visible ? 'Hide password' : 'Show password'"
        variant="text"
        size="small"
        density="comfortable"
        @click="visible = !visible"
      />
    </template>
  </v-text-field>
</template>
