import apiClient from "./apiClient.js";

export async function getChatHistory() {
  return apiClient.get("/api/chat/getChatHistory");
}

export async function sendMessage(message) {
  return apiClient.post("/api/chat/sendMessage", message);
}