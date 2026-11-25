// import { apiRequest, setToken } from "./api";

// export async function loginUser({ email, password }) {
//   const res = await apiRequest("/auth/login", {
//     method: "POST",
//     body: { email, password },
//   });

//   if (res?.data?.token) {
//     setToken(res.data.token);
//   }

//   return res.data; // { token, user }
// }

// export async function getCurrentUser() {
//   const res = await apiRequest("/auth/me", { method: "GET" });
//   return res?.data?.user || null;
// }

// export async function logoutUser() {
//   try {
//     await apiRequest("/auth/logout", { method: "POST" });
//   } finally {
//     setToken(null);
//   }
// } 
import { apiRequest, setToken } from "./api";

export async function loginUser({ email, password }) {
  const res = await apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
  });

  const token = res?.data?.accessToken || res?.data?.token;
  if (token) {
    setToken(token);
  }

  return res.data;
}

export async function getCurrentUser() {
  const res = await apiRequest("/auth/me", { method: "GET" });
  return res?.data?.user || null;
}

export async function logoutUser() {
  try {
    await apiRequest("/auth/logout", { method: "POST" });
  } catch {
    // Ignore expired/unauthorized backend logout errors so client always logs out cleanly
  } finally {
    setToken(null);
  }
}