import { reactive } from "vue";
import { hubRequest } from "./hubApi.js";

const state = reactive({ loaded: false, account: null, isOwner: false, google: false });

async function refreshSession() {
  const session = await hubRequest("/hub/api/session");
  Object.assign(state, { loaded: true, account: session.account, isOwner: session.isOwner, google: session.google });
  return state;
}

function setSession({ account = null, isOwner = false } = {}) {
  Object.assign(state, { loaded: true, account, isOwner });
}

async function signOut() {
  await hubRequest("/hub/api/sign-out", { method: "POST", body: {} });
  setSession();
}

/** The signed-in person, shared by every hub page. */
function useHubSession() {
  return { session: state, refreshSession, setSession, signOut };
}

export { useHubSession };
