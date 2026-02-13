const API = "https://qr-dine-backend-xbja.onrender.com/api/";

export async function authFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(API + endpoint, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error("API Error");
  }

  return response.json();
}
