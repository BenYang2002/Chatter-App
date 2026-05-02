import apiClient from "./apiClient.js";

export async function checkAvatar(userPK, localCreationTime) {
  return apiClient.post("/api/avatar/checkAvatar", { userPK, localCreationTime });
}

export async function getOwnProfilePicUrl(userPK) {
  return apiClient.post("/api/avatar/ProfilePic", { userPK });
}

export async function getProfilePicUrlById(userId) {
  return apiClient.get(`/api/avatar/profilePic/${userId}`);
}

export async function changeAvatar(file) {
  const { signedUrl, key } = await apiClient.post("/api/avatar/changeAvatar", {
    size: file.size,
    contentType: file.type,
  });

  const uploadRes = await fetch(signedUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!uploadRes.ok) throw new Error("Failed to upload avatar to cloud");

  await apiClient.post("/api/avatar/saveAvatar", { inputValue: key });
}
