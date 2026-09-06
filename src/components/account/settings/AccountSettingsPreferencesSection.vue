<script setup>
const props = defineProps({
  runtime: {
    type: Object,
    required: true
  }
});

const preferences = props.runtime.preferences;
</script>

<template>
  <v-sheet rounded="lg" border>
    <header class="pa-4 pb-0">
      <h2 class="text-h6 mb-0">Preferences</h2>
    </header>
    <div class="pa-4">
      <v-form @submit.prevent="preferences.submit" novalidate>
        <v-row>
          <v-col cols="12" md="4">
            <v-select
              v-model="preferences.form.theme"
              label="Theme"
              :items="preferences.options.theme"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="comfortable"
              :disabled="preferences.isSaving.value || preferences.isRefreshing.value"
              :error-messages="preferences.fieldErrors.theme ? [preferences.fieldErrors.theme] : []"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="preferences.form.locale"
              label="Language / locale"
              :items="preferences.options.locale"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="comfortable"
              :disabled="preferences.isSaving.value || preferences.isRefreshing.value"
              :error-messages="preferences.fieldErrors.locale ? [preferences.fieldErrors.locale] : []"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="preferences.form.timeZone"
              label="Time zone"
              :items="preferences.options.timeZone"
              variant="outlined"
              density="comfortable"
              :disabled="preferences.isSaving.value || preferences.isRefreshing.value"
              :error-messages="preferences.fieldErrors.timeZone ? [preferences.fieldErrors.timeZone] : []"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="preferences.form.dateFormat"
              label="Date format"
              :items="preferences.options.dateFormat"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="comfortable"
              :disabled="preferences.isSaving.value || preferences.isRefreshing.value"
              :error-messages="preferences.fieldErrors.dateFormat ? [preferences.fieldErrors.dateFormat] : []"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="preferences.form.numberFormat"
              label="Number format"
              :items="preferences.options.numberFormat"
              item-title="title"
              item-value="value"
              variant="outlined"
              density="comfortable"
              :disabled="preferences.isSaving.value || preferences.isRefreshing.value"
              :error-messages="preferences.fieldErrors.numberFormat ? [preferences.fieldErrors.numberFormat] : []"
            />
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="preferences.form.currencyCode"
              label="Currency"
              :items="preferences.options.currency"
              variant="outlined"
              density="comfortable"
              :disabled="preferences.isSaving.value || preferences.isRefreshing.value"
              :error-messages="preferences.fieldErrors.currencyCode ? [preferences.fieldErrors.currencyCode] : []"
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              v-model.number="preferences.form.avatarSize"
              label="Avatar size"
              :items="preferences.options.avatarSize"
              variant="outlined"
              density="comfortable"
              :disabled="preferences.isSaving.value || preferences.isRefreshing.value"
              :error-messages="preferences.fieldErrors.avatarSize ? [preferences.fieldErrors.avatarSize] : []"
            />
          </v-col>
        </v-row>

        <v-btn
          type="submit"
          color="primary"
          size="large"
          :disabled="preferences.isSaving.value || preferences.isRefreshing.value"
        >
          {{ preferences.isSaving.value ? "Saving preferences…" : "Save preferences" }}
        </v-btn>
      </v-form>
    </div>
  </v-sheet>
</template>
