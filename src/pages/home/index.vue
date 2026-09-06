<template>
  <section class="d-flex flex-column ga-6">
    <header>
      <p class="text-overline text-medium-emphasis mb-1">Home</p>
      <h1 class="text-h3 text-md-h2 mb-3">Welcome</h1>
      <p class="text-body-1 text-medium-emphasis mb-0">
        You are signed in. Your profile and preferences are available from account settings.
      </p>
    </header>

    <v-sheet rounded="xl" border class="pa-6 pa-md-8">
      <div class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-4">
        <div>
          <h2 class="text-h6 mb-2">Your account</h2>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Update your display name, preferences, avatar, and notification choices.
          </p>
        </div>
        <v-btn color="primary" variant="flat" size="large" to="/account">
          Manage account
        </v-btn>
      </div>
    </v-sheet>
  </section>
</template>
