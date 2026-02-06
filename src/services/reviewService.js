import { apiClient } from "./auth";

export default {
  async getReviews() {
    try {
      const res = await apiClient.get("/reviews");
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to load reviews";
    }
  },

  async createReview(data) {
    try {
      const res = await apiClient.post("/reviews", data);
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to submit review";
    }
  }
};
