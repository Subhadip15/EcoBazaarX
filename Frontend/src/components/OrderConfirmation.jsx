// src/components/OrderConfirmation.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainNavbar from "./MainNavbar";
import "../styles/OrderConfirmation.css";

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("User not authenticated");
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to fetch order");
        }

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch order");
      }
    };

    fetchOrder();
  }, [orderId, token]);

  if (error) return <p className="error-line">{error}</p>;
  if (!order) return <p>Loading order details...</p>;

  return (
    <main className="checkout-page">
      <MainNavbar />
      <section className="checkout-shell">
        <article className="card-panel confirmation-card">
          <p className="hero-kicker">Order Confirmed</p>
          <h1>Thank you for choosing greener shopping.</h1>
          <div className="confirm-grid">
            <p><span>Order ID</span><strong>{order.orderId}</strong></p>
            <p><span>Customer</span><strong>{order.customerName}</strong></p>
            <p><span>Email</span><strong>{order.email}</strong></p>
            <p><span>Total Paid</span><strong>${order.totalAmount.toFixed(2)}</strong></p>
            <p><span>Status</span><strong>{order.status}</strong></p>
          </div>
          <div className="hero-actions">
            <button className="outline-btn" onClick={() => navigate("/products")}>
              Continue Shopping
            </button>
            <button className="primary-btn" onClick={() => navigate("/my-orders")}>
              View My Orders
            </button>
          </div>
        </article>
      </section>
    </main>
  );
}