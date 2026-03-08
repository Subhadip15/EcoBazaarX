// src/components/PaymentDemo.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainNavbar from "../../components/layout/MainNavbar";
import { API_BASE_URL } from "../../config/api";
import "../../styles/PaymentDemo.css";

function PaymentDemo() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  const [status, setStatus] = useState("PROCESSING");
  const [orderDetails, setOrderDetails] = useState(order || null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!order) {
      navigate("/checkout"); // Redirect if no order data
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      return;
    }

    // Simulate payment processing and update backend
    const timer = setTimeout(async () => {
      try {
        // Call backend to update order status
        const response = await fetch(
          `${API_BASE_URL}/api/orders/${order.orderId}/pay`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: "PLACED" }),
          }
        );

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Payment failed");
        }

        const updatedOrder = await response.json();
        setOrderDetails(updatedOrder);
        setStatus("PAID");
      } catch (err) {
        console.error("Payment error:", err);
        setError(err.message || "Payment failed");
        setStatus("FAILED");
      }
    }, 2000); // 2-second demo payment

    return () => clearTimeout(timer);
  }, [order, navigate]);

  if (!order) return null;

  return (
    <main className="payment-demo-page">
      <MainNavbar />
      <section className="payment-shell">
        <article className="card-panel payment-card">
          <h1>Demo Payment Gateway</h1>
          {error && <p className="error-line">{error}</p>}

          <p><strong>Order ID:</strong> {orderDetails?.orderId}</p>
          <p><strong>Customer:</strong> {orderDetails?.customerName}</p>
          <p><strong>Amount:</strong> ₹{orderDetails?.totalAmount?.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> {orderDetails?.paymentMethod?.toUpperCase()}</p>

          <p className={`status ${status.toLowerCase()}`}>
            Status: {status}
          </p>

          {status === "PAID" && (
            <button
              className="primary-btn"
              onClick={() => navigate("/my-orders")}
            >
              Go to My Orders
            </button>
          )}
        </article>
      </section>
    </main>
  );
}

export default PaymentDemo;
