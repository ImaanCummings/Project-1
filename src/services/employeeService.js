import { apiClient } from "./auth";

import api from './api'

export default {
  async getEmployees() {
    try {
      const res = await apiClient.get("/employees");
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to load employees";
    }
  },

  async createEmployee(data) {
    try {
      const res = await apiClient.post("/employees", data);
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to add employee";
    }
  },

  async updateEmployee(id, data) {
    try {
      const res = await apiClient.put(`/employees/${id}`, data);
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to update employee";
    }
  },

  async deleteEmployee(id) {
    try {
      const res = await apiClient.delete(`/employees/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data?.message || "Failed to delete employee";
    }
  }
};

