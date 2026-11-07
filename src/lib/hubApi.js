import { leaveApp, reloadAppPage } from "@jskit-ai/shell-web/client/navigation/documentNavigation";

/** Talks to the hub's own API. State-changing calls carry x-hub-request, which other sites cannot send. */
class HubRequestError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function hubRequest(path, { method = "GET", body } = {}) {
  const headers = {};
  if (body !== undefined) headers["content-type"] = "application/json";
  if (method !== "GET") headers["x-hub-request"] = "1";
  let response;
  try {
    response = await fetch(path, {
      method,
      credentials: "same-origin",
      headers,
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch {
    throw new HubRequestError(0, "offline", "The hub could not be reached. Check your connection and try again.");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new HubRequestError(response.status, data.error || "hub_failed", data.message || "Something went wrong. Try again in a moment.");
  }
  return data;
}

/**
 * Follows a redirectTo the hub's server answered with, as a new document: on the hub's own origin a hub route (an
 * interaction's resume, which hands the person back to their app, or a hub page once they are signed in), otherwise
 * another site.
 */
function followHubRedirect(redirectTo) {
  const target = new URL(redirectTo, window.location.href);
  if (target.origin === window.location.origin) reloadAppPage(`${target.pathname}${target.search}${target.hash}`);
  else leaveApp(target.href, { replace: true });
}

/** The hub's server route that sends the person to Google: to sign in (for an interaction) or to connect it. */
function googleStartHref({ intent, interaction = "" }) {
  const query = new URLSearchParams({ intent });
  if (interaction) query.set("interaction", interaction);
  return `/hub/google/start?${query}`;
}

export { followHubRedirect, googleStartHref, hubRequest };
