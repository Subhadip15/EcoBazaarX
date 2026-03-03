// src/components/CheckoutPage.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainNavbar from "./MainNavbar";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import "../styles/CartCheckout.css";

function round(value) {
  return Math.round(value * 100) / 100;
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { items = [], subtotal = 0, totalEmission = 0, clearCart } = useCart() || {};

  const [form, setForm] = useState({
  fullName: "",
  email: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  paymentMethod: "cod",
});

  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const shipping = useMemo(() => (subtotal > 100 ? 0 : 7.5), [subtotal]);
  const total = useMemo(() => round(subtotal + shipping), [subtotal, shipping]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const onPlaceOrder = async (e) => {
    e.preventDefault();

    if (!(items?.length > 0)) {
      setError("Your cart is empty.");
      showToast("Your cart is empty.", "error");
      return;
    }

   // Change this line:
// if (!form.fullName || !form.email || !form.address) {

// To this:
if (!form.fullName || !form.email || !form.street || !form.city || !form.state || !form.zipCode) {
  setError("Please complete all checkout fields.");
  showToast("Please complete all checkout fields.", "error");
  return;
}

    setProcessing(true);

    try {
     const payload = {
  fullName: form.fullName,
  email: form.email,
  paymentMethod: form.paymentMethod,

  address: {
    street: form.street,
    city: form.city,
    state: form.state,
    zipCode: form.zipCode,
  },

  items,
  subtotal,
  shipping,
  total,
  totalEmission,
};

      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not authenticated");

      const response = await fetch("http://localhost:8080/api/orders/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to place order");
      }

      const order = await response.json();

      clearCart?.();

      if (["upi", "card"].includes(form.paymentMethod)) {
        // Navigate to PaymentDemo with backend order
        navigate("/payment-demo", { state: { order } });
      } else {
        setConfirmation(order);
        showToast("Order placed successfully.", "success");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Failed to place order");
      showToast(err.message || "Failed to place order", "error");
    } finally {
      setProcessing(false);
    }
  };

  // ======================== Confirmation Screen ========================
  if (confirmation) {
    return (
      <main className="checkout-page">
        <MainNavbar />
        <section className="checkout-shell">
          <article className="card-panel confirmation-card">
            <p className="hero-kicker">Order Confirmed</p>
            <h1>Thank you for choosing greener shopping.</h1>

            <div className="confirm-grid">
              <p>
                <span>Order ID</span>
                <strong>{confirmation?.orderId || "-"}</strong>
              </p>
              <p>
                <span>Customer</span>
                <strong>{form.fullName || "-"}</strong>
              </p>
              <p>
                <span>Email</span>
                <strong>{form.email || "-"}</strong>
              </p>
              <p>
                <span>Total Paid</span>
                <strong>${confirmation?.total?.toFixed(2) || "0.00"}</strong>
              </p>
              <p>
                <span>Placed At</span>
                <strong>
                  {confirmation?.createdAt
                    ? new Date(confirmation.createdAt).toLocaleString()
                    : "-"}
                </strong>
              </p>
              <p>
                <span>Status</span>
                <strong>{confirmation?.status || "-"}</strong>
              </p>
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

  // ======================== Checkout Form ========================
  return (
    <main className="checkout-page">
      <MainNavbar />
      <section className="checkout-shell">
        <header className="checkout-hero">
          <div>
            <p className="hero-kicker">Smart Checkout</p>
            <h1>Review and Confirm</h1>
            <p>One last check on budget and emissions before placing your order.</p>
          </div>
        </header>

        <section className="checkout-grid">
          <article className="card-panel">
            <h2>Delivery & Payment</h2>
            <form className="checkout-form" onSubmit={onPlaceOrder}>
              <label>
                Full Name
                <input
                  name="fullName"
                  value={form.fullName || ""}
                  onChange={onChange}
                  placeholder="Enter your full name"
                />
              </label>

              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email || ""}
                  onChange={onChange}
                  placeholder="name@example.com"
                />
              </label>

             <label>
  Street
  <input
    name="street"
    value={form.street}
    onChange={onChange}
    placeholder="Street address"
  />
</label>

<label>
  City
  <input
    name="city"
    value={form.city}
    onChange={onChange}
    placeholder="City"
  />
</label>

<label>
  State
  <input
    name="state"
    value={form.state}
    onChange={onChange}
    placeholder="State"
  />
</label>

<label>
  Zip Code
  <input
    name="zipCode"
    value={form.zipCode}
    onChange={onChange}
    placeholder="Postal code"
  />
</label>

              <label>
                Payment Method
                <select
                  name="paymentMethod"
                  value={form.paymentMethod || "cod"}
                  onChange={onChange}
                >
                  <option value="cod">Pay on Delivery</option>
                  <option value="card">Card Payment (UI only)</option>
                  <option value="upi">UPI (UI only)</option>
                </select>
              </label>

              {error && <p className="error-line">{error}</p>}

              <button
                type="submit"
                className="primary-btn"
                disabled={processing || !(items?.length > 0)}
              >
                {processing ? "Placing order..." : "Place Order"}
              </button>
            </form>
          </article>

          <aside className="card-panel summary-panel">
            <h2>Order Snapshot</h2>
            <div className="summary-line">
              <span>Items</span>
              <strong>{items?.length || 0}</strong>
            </div>
            <div className="summary-line">
              <span>Subtotal</span>
              <strong>${subtotal?.toFixed(2) || "0.00"}</strong>
            </div>
            <div className="summary-line">
              <span>Shipping</span>
              <strong>{shipping ? `$${shipping.toFixed(2)}` : "Free"}</strong>
            </div>
            <div className="summary-line">
              <span>Total</span>
              <strong>${total?.toFixed(2) || "0.00"}</strong>
            </div>
            <div className="summary-line">
              <span>Estimated CO2</span>
              <strong>{totalEmission?.toFixed(2) || "0.00"} kg CO2e</strong>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

export default CheckoutPage;