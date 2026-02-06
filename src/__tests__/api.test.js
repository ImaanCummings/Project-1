import { describe, it, expect, vi, afterEach } from "vitest";
import { api } from "../services/api";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("api", () => {
  it("getEmployees returns json", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: () => "application/json" },
      json: async () => [{ employee_id: 1, name: "Test" }],
    });

    const data = await api.getEmployees();
    expect(data).toEqual([{ employee_id: 1, name: "Test" }]);
  });

  it("throws on error response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      headers: { get: () => "application/json" },
      json: async () => ({ error: "Bad request" }),
    });

    await expect(api.getEmployees()).rejects.toThrow("Bad request");
  });
});
