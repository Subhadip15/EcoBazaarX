// src/services/orderService.js
import axios from "axios";

// Base API URL
const API_URL = "http://localhost:8080/api/orders";

// ================= AUTH HEADER =================
function getAuthHeader() {
  const token = localStorage.getItem("token"); // JWT stored after login
  if (!token) {
    throw new Error("User not authenticated");
  }
  return { Authorization: `Bearer ${token}` };
}

// ================= PLACE ORDER =================
/**
 * Place a new order
 * @param {Object} orderData - { fullName, email, addressId, paymentMethod }
 * @returns {Promise} Axios response
 */
export async function placeOrderApi(orderData) {
  try {
    const response = await axios.post(`${API_URL}/place`, orderData, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error placing order:", error.response || error);
    throw error.response?.data || { message: "Failed to place order" };
  }
}

// ================= FETCH USER ORDERS =================
/**
 * Fetch all orders for the logged-in user
 * @returns {Promise} Array of orders
 */
export async function fetchOrdersApi() {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error.response || error);
    throw error.response?.data || { message: "Failed to fetch orders" };
  }
}

// ================= FETCH SINGLE ORDER =================
/**
 * Fetch single order by ID
 * @param {number|string} orderId - ID of the order
 * @returns {Promise} Order details
 */
export async function fetchOrderById(orderId) {
  try {
    const response = await axios.get(`${API_URL}/${orderId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error.response || error);
    throw error.response?.data || { message: "Failed to fetch order" };
  }
}