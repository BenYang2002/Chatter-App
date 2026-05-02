import apiClient from "./apiClient.js";

export async function getUserSummary() {
  return apiClient.get("/api/user/getUserSummary");
}

export async function getUserId() {
  return apiClient.get("/api/user/getUserId");
}

export async function getUserNameById(userId) {
  return apiClient.get(`/api/user/getUserNameById/${userId}`);
}

export async function changeName(name) {
  return apiClient.post("/api/user/changeName", { inputValue: name });
}

export async function changeEmail(email) {
  return apiClient.post("/api/user/changeEmail", { inputValue: email });
}

export async function changePassword(password) {
  return apiClient.post("/api/user/changePassword", { inputValue: password });
}

export async function confirmPassword(password) {
  return apiClient.post("/api/user/confirmPassword", { inputValue: password });
}

export async function createUserId(userId) {
  return apiClient.post("/api/user/createUserId", { inputValue: userId });
}

export async function updateNFR(userPK) {
  return apiClient.post("/api/userSummary/updateNFR", { userPK });
}
