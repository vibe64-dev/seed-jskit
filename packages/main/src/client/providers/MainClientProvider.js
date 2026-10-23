import { defineProvider } from "@jskit-ai/kernel/shared/capabilities";

// The hub's pages are plain Vue pages with their own layout, so the
// app-local client lane registers no shell components.
const MainClientProvider = defineProvider({
  id: "local.main.client",
  requires: {},
  setup() {}
});

export { MainClientProvider };
