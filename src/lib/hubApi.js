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

export { hubRequest };
