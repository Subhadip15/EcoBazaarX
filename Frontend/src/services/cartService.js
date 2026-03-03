import axios from "axios";
import { API_BASE_URL } from "../config/api";

const cartApi = axios.create({
  baseURL: `${API_BASE_URL}/api/cart`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token automatically
cartApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return Promise.reject(new Error("User not authenticated. Please login."));
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ================= LOAD CART =================
export async function fetchCart() {
  const res = await cartApi.get("");
  return res.data;
}

// ================= ADD TO CART =================
export async function addToCart(productId, quantity = 1) {
  const res = await cartApi.post("/add", {
    productId,
    quantity,
  });
  return res.data;
}

// ================= REMOVE ITEM =================
export async function removeFromCart(itemId) {
  const res = await cartApi.delete(`/remove/${itemId}`);
  return res.data;
}

// ================= CLEAR CART =================
export async function clearCart() {
  const res = await cartApi.delete("/clear");
  return res.data;
}

// ================= UPDATE QUANTITY =================
export async function updateQuantity(productId, quantityChange) {
  // PATCH request using your UpdateCartRequest DTO
  const res = await cartApi.patch("/update", {
    productId,
    quantityChange, // can be +1 or -1
  });
  return res.data;
}