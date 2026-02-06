import { apiClient } from "./auth";

export default {
  async getPayroll() {
    try {
      const res = await apiClient.get("/payroll");
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to load payroll";
    }
  },

  async calculatePayroll(data) {
    try {
      const res = await apiClient.post("/payroll/calculate", data);
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Payroll calculation failed";
    }
  },

  async savePayroll(data) {
    try {
      const res = await apiClient.post("/payroll", data);
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to save payroll";
    }
  }
};
