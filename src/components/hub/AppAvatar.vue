<script setup>
import { computed } from "vue";
import { initials } from "../../lib/format.js";

const props = defineProps({ name: { type: String, required: true }, size: { type: Number, default: 40 } });
const COLORS = ["primary", "secondary", "success", "warning"];
const color = computed(() => COLORS[[...props.name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % COLORS.length]);
</script>

<template>
  <v-avatar :size="size" :color="color" variant="tonal" rounded="lg">
    <span class="text-body-2 font-weight-bold">{{ initials(name) }}</span>
  </v-avatar>
</template>
