<route lang="json">
{
  "meta": {
    "guard": {
      "policy": "authenticated"
    },
    "jskit": {
      "surface": "account"
    }
  }
}
</route>

<script setup>
import AccountSettingsClientElement from "@jskit-ai/users-web/client/components/AccountSettingsClientElement";
</script>

<template>
  <AccountSettingsClientElement />
</template>
