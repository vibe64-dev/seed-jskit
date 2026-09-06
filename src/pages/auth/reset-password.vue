<route lang="json">
{
  "meta": {
    "guard": {
      "policy": "public"
    },
    "jskit": {
      "surface": "auth"
    }
  }
}
</route>

<script setup>
import DefaultResetPasswordView from "@jskit-ai/auth-web/client/views/DefaultResetPasswordView";
</script>

<template>
  <DefaultResetPasswordView />
</template>
