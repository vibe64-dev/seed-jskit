import { afterEach, describe, expect, it, vi } from "vitest";
import { deviceName, hostOf, initials, timeAgo } from "../../src/lib/format.js";
import { hubRequest } from "../../src/lib/hubApi.js";
import { safeNext } from "../../src/lib/useSignInFlow.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("format", () => {
  it("names times in the past, and a clock running slightly ahead as now", () => {
    expect(timeAgo(new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString())).toBe("3 hours ago");
    expect(timeAgo(new Date(Date.now() + 5000).toISOString())).toBe("now");
    expect(timeAgo(null)).toBe("");
  });

  it("makes avatar initials, device names and hosts", () => {
    expect(initials("Ada Lovelace")).toBe("AL");
    expect(initials("Shop")).toBe("SH");
    expect(deviceName("Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0")).toBe("Firefox on Linux");
    expect(hostOf("https://shop.example.com")).toBe("shop.example.com");
  });
});

describe("sign-in flow", () => {
  it("only returns to a page on this hub", () => {
    expect(safeNext("/admin/apps")).toBe("/admin/apps");
    expect(safeNext("//evil.example/x")).toBe("/account");
    expect(safeNext("https://evil.example")).toBe("/account");
    expect(safeNext(undefined)).toBe("/account");
  });
});

describe("hub requests", () => {
  it("send the hub's request header only on state-changing calls", async () => {
    const fetch = vi.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetch);
    await hubRequest("/hub/api/session");
    await hubRequest("/hub/api/sign-out", { method: "POST", body: {} });
    expect(fetch.mock.calls[0][1].headers).toEqual({});
    expect(fetch.mock.calls[1][1].headers).toEqual({ "content-type": "application/json", "x-hub-request": "1" });
  });

  it("turn the hub's one-sentence errors into a readable error", async () => {
    vi.stubGlobal("fetch", async () => new Response(JSON.stringify({ error: "pending", message: "This app is waiting for approval by the hub's owner." }), { status: 403 }));
    await expect(hubRequest("/hub/interaction/x/continue", { method: "POST", body: {} })).rejects.toMatchObject({
      status: 403,
      code: "pending",
      message: "This app is waiting for approval by the hub's owner."
    });
  });
});
