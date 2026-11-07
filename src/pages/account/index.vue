<route lang="json">
{
  "meta": {
    "guard": {
      "policy": "authenticated"
    },
    "jskit": {
      "title": "Account settings",
      "parent": {
        "surface": "home",
        "path": "/"
      }
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
