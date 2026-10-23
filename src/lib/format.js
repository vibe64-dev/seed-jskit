const relative = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
const STEPS = [
  [60, "second"],
  [60, "minute"],
  [24, "hour"],
  [7, "day"],
  [4.35, "week"],
  [12, "month"],
  [Number.POSITIVE_INFINITY, "year"]
];

/** "2 minutes ago", "yesterday", "3 months ago". */
function timeAgo(value) {
  if (!value) return "";
  // A server clock slightly ahead of this one must not read as "in 5 seconds".
  let amount = Math.min(0, (new Date(value).getTime() - Date.now()) / 1000);
  for (const [size, unit] of STEPS) {
    if (Math.abs(amount) < size) return relative.format(Math.round(amount), unit);
    amount /= size;
  }
  return "";
}

/** Two letters for an avatar: "Shop" → "SH", "Ada Lovelace" → "AL". */
function initials(value) {
  const words = String(value || "").trim().split(/\s+/u).filter(Boolean);
  if (words.length > 1) return `${words[0][0]}${words[1][0]}`.toUpperCase();
  return (words[0] || "?").slice(0, 2).toUpperCase();
}

/** A device name from a browser's user agent: "Firefox on Linux". */
function deviceName(userAgent) {
  const agent = String(userAgent || "");
  const browser = /Edg\//u.test(agent) ? "Edge" : /Firefox\//u.test(agent) ? "Firefox" : /Chrome\//u.test(agent) ? "Chrome" : /Safari\//u.test(agent) ? "Safari" : "A browser";
  const system = /iPhone|iPad/u.test(agent) ? "iOS" : /Android/u.test(agent) ? "Android" : /Mac OS X/u.test(agent) ? "macOS" : /Windows/u.test(agent) ? "Windows" : /Linux/u.test(agent) ? "Linux" : "";
  return system ? `${browser} on ${system}` : browser;
}

function hostOf(origin) {
  try {
    return new URL(origin).host;
  } catch {
    return String(origin || "");
  }
}

export { deviceName, hostOf, initials, timeAgo };
