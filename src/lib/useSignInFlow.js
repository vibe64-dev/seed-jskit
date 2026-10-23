import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { hubRequest } from "./hubApi.js";

const SAME_ORIGIN_PROBE = "http://next.invalid";

// Browsers read "/\\host" and "/<tab>/host" as another site, so a path counts
// only if it starts with one slash and resolves on the hub's own origin.
function safeNext(value) {
  const next = String(value || "");
  if (!next.startsWith("/")) return "/account";
  try {
    return new URL(next, SAME_ORIGIN_PROBE).origin === SAME_ORIGIN_PROBE ? next : "/account";
  } catch {
    return "/account";
  }
}

/**
 * Where a hub sign-in goes next: back to the app that sent the person here
 * (an interaction), or to a hub page.
 */
function useSignInFlow() {
  const route = useRoute();
  const router = useRouter();
  const interaction = computed(() => (typeof route.query.interaction === "string" ? route.query.interaction : ""));

  function withFlow(path) {
    const query = {};
    if (interaction.value) query.interaction = interaction.value;
    else if (route.query.next) query.next = route.query.next;
    return { path, query };
  }

  async function finish() {
    if (interaction.value) {
      const { redirectTo } = await hubRequest(`/hub/interaction/${encodeURIComponent(interaction.value)}/continue`, {
        method: "POST",
        body: {}
      });
      window.location.assign(redirectTo);
      return;
    }
    await router.replace(safeNext(route.query.next));
  }

  function googleHref() {
    const query = new URLSearchParams({ intent: "sign-in" });
    if (interaction.value) query.set("interaction", interaction.value);
    return `/hub/google/start?${query}`;
  }

  return { interaction, withFlow, finish, googleHref };
}

export { safeNext, useSignInFlow };
