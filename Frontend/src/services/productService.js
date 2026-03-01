import axios from "axios";
import { API_BASE_URL } from "../config/api";

/* ================= AXIOS INSTANCE ================= */

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= REQUEST INTERCEPTOR ================= */
// Automatically attach token to every request

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= ERROR HANDLER ================= */

function handleError(error, fallbackMessage) {
  if (error.response) {
    const status = error.response.status;

    if (status === 401) {
      throw new Error("Session expired. Please login again.");
    }

    if (status === 403) {
      throw new Error("Access denied. Admin privileges required.");
    }

    if (status === 404) {
      throw new Error("API route not found. Check backend endpoint.");
    }

    throw new Error(
      error.response.data?.message ||
      error.response.data?.error ||
      fallbackMessage
    );
  }

  throw new Error(
    `Cannot connect to backend at ${API_BASE_URL}. Is server running?`
  );
}

/* ================= GET ALL PRODUCTS ================= */

export async function getProducts() {
  try {
    const res = await api.get("/products");
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    handleError(error, "Failed to load products");
  }
}

/* ================= GET PRODUCT BY ID ================= */

export async function getProductById(id) {
  try {
    const res = await api.get(`/product/${id}`);
    return res.data;
  } catch (error) {
    handleError(error, "Product not found");
  }
}

/* ================= CREATE PRODUCT (ADMIN) ================= */

export async function createProduct(productData) {
  try {
    const res = await api.post("/product", productData);
    return res.data;
  } catch (error) {
    handleError(error, "Failed to create product");
  }
}

/* ================= UPDATE PRODUCT (ADMIN) ================= */

export async function updateProduct(id, productData) {
  try {
    const res = await api.put(`/product/${id}`, productData);
    return res.data;
  } catch (error) {
    handleError(error, "Failed to update product");
  }
}

/* ================= DELETE PRODUCT (ADMIN) ================= */

export async function deleteProduct(id) {
  try {
    const res = await api.delete(`/product/${id}`);
    return res.data;
  } catch (error) {
    handleError(error, "Failed to delete product");
  }
}

/* ================= SEARCH PRODUCTS ================= */

export async function searchProducts(keyword) {
  try {
    const res = await api.get("/products/search", {
      params: { keyword },
    });
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    handleError(error, "Search failed");
  }
}