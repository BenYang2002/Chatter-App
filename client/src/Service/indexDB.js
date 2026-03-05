import { openDB } from "idb";
const dbPromise = openDB("chatter-db", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("profile-pictures")) {
      db.createObjectStore("profile-pictures");
    }
    if (!db.objectStoreNames.contains("profile-pictures-creation-time")) {
      db.createObjectStore("profile-pictures-creation-time");
    }
    if (!db.objectStoreNames.contains("chat-pictures")) {
      db.createObjectStore("chat-pictures");
    }
    if (!db.objectStoreNames.contains("post-pictures")) {
      db.createObjectStore("post-pictures");
    }
  },
});

async function saveProfilePicTime(key, file) {
  const db = await dbPromise;
  db.put("profile-pictures-creation-time", file, key);
}

async function getProfilePicTime(key) {
  const db = await dbPromise;
  return db.get("profile-pictures-creation-time", key);
}

async function deleteProfilePicTime(key) {
  const db = await dbPromise;
  db.delete("profile-pictures-creation-time", key);
}

async function saveProfilePic(key, file) {
  const db = await dbPromise;
  db.put("profile-pictures", file, key);
}

async function getProfilePic(key) {
  const db = await dbPromise;
  return db.get("profile-pictures", key);
}

async function deleteProfilePic(key) {
  const db = await dbPromise;
  db.delete("profile-pictures", key);
}

async function saveChatPic(key, file) {
  const db = await dbPromise;
  db.put("chat-pictures", file, key);
}

async function getChatPic(key) {
  const db = await dbPromise;
  return db.get("chat-pictures", key);
}

async function deleteChatPic(key) {
  const db = await dbPromise;
  db.delete("chat-pictures", key);
}

async function savePostPic(key, file) {
  const db = await dbPromise;
  db.put("post-pictures", file, key);
}

async function getPostPic(key) {
  const db = await dbPromise;
  return db.get("post-pictures", key);
}

async function deletePostPic(key) {
  const db = await dbPromise;
  db.delete("post-pictures", key);
}

export {
  dbPromise,
  saveProfilePic,
  getProfilePic,
  saveChatPic,
  getChatPic,
  savePostPic,
  getPostPic,
  saveProfilePicTime,
  getProfilePicTime,
  deleteProfilePicTime,
  deleteProfilePic,
  deleteChatPic,
  deletePostPic,
};
