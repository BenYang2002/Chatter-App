import apiClient from "./apiClient.js";

export async function initializeConversations(userPK) {
  return apiClient.post("/api/conversations/initializeConversations", {
    userPK,
  });
}

export async function avatarHelper(userPK, friendId) {
  return apiClient.post("/api/conversations/avatarHelper", {
    userPK,
    friendId,
  });
}
