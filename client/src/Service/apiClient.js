async function request(url, options) {
  const res = await fetch(url, {
    credentials: "include",
    ...options,
  });
  const text = await res.text();
  const body = text
    ? (() => {
        try {
          return JSON.parse(text);
        } catch {
          return text;
        }
      })()
    : null;
  if (res.ok) {
    return body;
  }
  let error = body;
  const err = new Error(error?.message || "Something went wrong");
  err.status = res.status;
  err.error = error;
  throw err;
}
const apiClient = {
  get: (url) => request(url),
  put: (url, body) =>
    request(url, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }),
  post: (url, body) =>
    request(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }),
  delete: (url) => request(url, { method: "DELETE" }),
};
export default apiClient;
