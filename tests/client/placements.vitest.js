import { describe, expect, it } from "vitest";
import getPlacements from "../../src/placement.js";

describe("account app placement composition", () => {
  it("exposes account controls and settings sections", () => {
    const ids = getPlacements().map((placement) => placement.id);

    expect(ids).toContain("auth.profile.widget");
    expect(ids).toContain("users.profile.menu.settings");
    expect(ids).toContain("users.account.settings.profile");
    expect(ids).toContain("users.account.settings.preferences");
    expect(ids).toContain("users.account.settings.notifications");
  });
});
