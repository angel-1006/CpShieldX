import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // Django backend
});

// Attach JWT token automatically, but skip for public endpoints
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  // Don't attach token for login/register endpoints
  if (
    !config.url.includes("/users/register/") &&
    !config.url.includes("/users/token/")
  ) {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;