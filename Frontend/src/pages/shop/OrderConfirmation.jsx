import { useLocation, useNavigate } from "react-router-dom";
import MainNavbar from "../../components/layout/MainNavbar";

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { order } = state || {};

  if (!order) navigate("/products");

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
            <p><span>Total Paid</span><strong>₹{Number(order.totalAmount || 0).toFixed(2)}</strong></p>
            <p><span>Status</span><strong>{order.status}</strong></p>
          </div>
          <div className="hero-actions">
            <button className="outline-btn" onClick={() => navigate("/products")}>Continue Shopping</button>
            <button className="primary-btn" onClick={() => navigate("/my-orders")}>View My Orders</button>
          </div>
        </article>
      </section>
    </main>
  );
}
