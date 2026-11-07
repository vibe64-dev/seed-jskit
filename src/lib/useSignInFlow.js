import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePaths } from "@jskit-ai/shell-web/client/navigation/usePaths";
import { followHubRedirect, googleStartHref, hubRequest } from "./hubApi.js";

const SAME_ORIGIN_PROBE = "http://next.invalid";

// Browsers read "/\\host" and "/<tab>/host" as another site, so a path counts
// only if it starts with one slash and resolves on the hub's own origin;
// anything else goes to the fallback page.
function safeNext(value, fallback) {
  const next = String(value || "");
  if (!next.startsWith("/")) return fallback;
  try {
    return new URL(next, SAME_ORIGIN_PROBE).origin === SAME_ORIGIN_PROBE ? next : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Where a hub sign-in goes next: back to the app that sent the person here
 * (an interaction), or to a hub page.
 */
function useSignInFlow() {
  const route = useRoute();
  const router = useRouter();
  const paths = usePaths();
  const interaction = computed(() => (typeof route.query.interaction === "string" ? route.query.interaction : ""));

  /** An auth page (its path on the auth surface, such as "/sign-in"), keeping the flow's interaction or next page. */
  function withFlow(authPage) {
    const query = {};
    if (interaction.value) query.interaction = interaction.value;
    else if (route.query.next) query.next = route.query.next;
    return { path: paths.page(authPage, { surface: "auth" }), query };
  }

  async function finish() {
    if (interaction.value) {
      const { redirectTo } = await hubRequest(`/hub/interaction/${encodeURIComponent(interaction.value)}/continue`, {
        method: "POST",
        body: {}
      });
      followHubRedirect(redirectTo);
      return;
    }
    await router.replace(safeNext(route.query.next, paths.page("/", { surface: "account" })));
  }

  function googleHref() {
    return googleStartHref({ intent: "sign-in", interaction: interaction.value });
  }

  return { interaction, withFlow, finish, googleHref };
}

export { safeNext, useSignInFlow };
