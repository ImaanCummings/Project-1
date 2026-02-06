const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const config = { ...options, headers };

  const response = await fetch(url, config);
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message = typeof data === "string" ? data : data?.error || data?.message || "Request failed";
    throw new Error(message);
  }

  return data;
}

export const api = {
  getEmployees: () => request("/employees"),
  addEmployee: (payload) => request("/employees", { method: "POST", body: JSON.stringify(payload) }),

  getAttendance: () => request("/attendance"),
  addAttendance: (payload) => request("/attendance", { method: "POST", body: JSON.stringify(payload) }),

  getPayroll: () => request("/payroll"),
  addPayroll: (payload) => request("/payroll", { method: "POST", body: JSON.stringify(payload) }),

  getReviews: () => request("/reviews"),
  addReview: (payload) => request("/reviews", { method: "POST", body: JSON.stringify(payload) }),

  getLeaves: () => request("/timeoff"),
  addLeave: (payload) => request("/timeoff", { method: "POST", body: JSON.stringify(payload) }),
  updateLeaveStatus: (id, payload) =>
    request(`/timeoff/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
};
