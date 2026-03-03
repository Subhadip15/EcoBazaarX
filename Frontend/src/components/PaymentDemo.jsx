// src/components/PaymentDemo.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MainNavbar from "./MainNavbar";
import "../styles/PaymentDemo.css";

export default function PaymentDemo() {
  const { orderId } = useParams(); // fetch orderId from URL
  const navigate = useNavigate();

  const [orderDetails, setOrderDetails] = useState(null);
  const [status, setStatus] = useState("PROCESSING");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setError("User not authenticated");
      return;
    }

    const processPayment = async () => {
      try {
        // 1️⃣ Call backend to pay order
        const res = await fetch(`http://localhost:8080/api/orders/${orderId}/pay`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Payment failed");
        }

        const updatedOrder = await res.json();
        setOrderDetails(updatedOrder);
        setStatus("PAID");
      } catch (err) {
        console.error(err);
        setError(err.message || "Payment failed");
        setStatus("FAILED");
      }
    };

    processPayment();
  }, [orderId, token]);

  if (!orderDetails) return <p>Processing payment...</p>;

  return (
    <main className="payment-demo-page">
      <MainNavbar />
      <section className="payment-shell">
        <article className="card-panel payment-card">
          <h1>Payment Gateway</h1>
          {error && <p className="error-line">{error}</p>}

          <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
          <p><strong>Customer:</strong> {orderDetails.customerName}</p>
          <p><strong>Amount:</strong> ${orderDetails.totalAmount.toFixed(2)}</p>
          <p><strong>Payment Method:</strong> {orderDetails.paymentMethod.toUpperCase()}</p>

          <p className={`status ${status.toLowerCase()}`}>Status: {status}</p>

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