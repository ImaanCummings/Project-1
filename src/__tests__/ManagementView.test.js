import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ManagementView from "../views/ManagementView.vue";

vi.mock("../services/api", () => ({
  api: {
    getEmployees: vi.fn().mockRejectedValue(new Error("API down")),
  },
}));

describe("ManagementView", () => {
  it("renders heading and fallback employees", async () => {
    const wrapper = mount(ManagementView);
    await Promise.resolve();
    await Promise.resolve();
    expect(wrapper.text()).toContain("Employee Management");
    expect(wrapper.findAll(".employee-card").length).toBeGreaterThan(0);
  });
});
