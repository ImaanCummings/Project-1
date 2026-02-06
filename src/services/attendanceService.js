import { apiClient } from "./auth";
import api from './api'


export default {
  async getAttendance() {
    try {
      const res = await apiClient.get("/attendance");
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to load attendance";
    }
  },
  async getAttendance() {
    const res = await api.get('/attendance')
    return res.data
  }
}

  async markAttendance(data) {
    try {
      const res = await apiClient.post("/attendance", data);
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to mark attendance";
    }
  }
};
