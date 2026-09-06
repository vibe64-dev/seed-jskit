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
import DefaultSignOutView from "@jskit-ai/auth-web/client/views/DefaultSignOutView";
</script>

<template>
  <DefaultSignOutView />
</template>
