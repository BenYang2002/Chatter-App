import apiClient from "./apiClient.js";
export async function login(email, password) {
  return apiClient.post("api/auth/login", { email, password });
}

export async function register(username, email, password) {
  return apiClient.post("api/auth/register", { username, email, password });
}

export async function checkAuth() {
  return apiClient.get("api/auth/me");
}
