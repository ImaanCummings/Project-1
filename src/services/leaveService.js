import { apiClient } from "./auth";

export default {
  async getLeaves() {
    try {
      const res = await apiClient.get("/leave");
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to load leave requests";
    }
  },

  async createLeave(data) {
    try {
      const res = await apiClient.post("/leave", data);
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to submit leave";
    }
  },

  async updateLeave(id, data) {
    try {
      const res = await apiClient.put(`/leave/${id}`, data);
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to update leave";
    }
  }
};
