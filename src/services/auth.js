import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default {
  async login(credentials) {
    try {
      const response = await apiClient.post("/auth/login", credentials);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  },

  async register(data) {
    try {
      const response = await apiClient.post("/auth/register", data);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Registration failed";
    }
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  }
};
