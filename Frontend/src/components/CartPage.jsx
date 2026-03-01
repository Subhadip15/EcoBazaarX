// src/components/CartPage.jsx
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import MainNavbar from "./MainNavbar";
import "../styles/CartPage.css";

function CartPage() {
  const {
    items = [],
    subtotal = 0,
    totalEmission = 0,
    cartId,
    loading,
    removeFromCart,
    clearCart,
    updateQuantity,
  } = useCart();

  const navigate = useNavigate();

  // Increase quantity
  const handleIncrease = (productId) => {
    if (!productId) return;
    updateQuantity(productId, 1);
  };

  // Decrease quantity
  const handleDecrease = (item) => {
    if (!item || !item.productId || !item.itemId) return;
    if (item.quantity === 1) {
      removeFromCart(item.itemId);
    } else {
      updateQuantity(item.productId, -1);
    }
  };

  if (loading) {
    return (
      <div className="cart-wrapper">
        <div className="cart-empty">
          <h2>Loading your cart...</h2>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="cart-wrapper">
        <MainNavbar />
        <div className="cart-empty">
          <h2>Your cart is empty 🛒</h2>
          <button className="primary-btn" onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const shipping = subtotal > 100 ? 0 : 50; // Example delivery charge

  return (
    <div className="cart-wrapper">
      <MainNavbar />
      <div className="cart-layout">
        {/* LEFT: Cart Items */}
        <div className="cart-left">
          <h2 className="cart-title">My Cart ({items.length})</h2>

          {items.map((item) => (
            <div key={item.itemId || item.productId} className="cart-card">
              <div className="cart-info">
                <h3 className="product-name">{item.productName || "Product"}</h3>
                <p className="price">₹{item.price?.toFixed(2) || "0.00"}</p>

                {/* QUANTITY CONTROLS */}
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => handleDecrease(item)}>
                    -
                  </button>
                  <span className="qty-value">{item.quantity || 0}</span>
                  <button className="qty-btn" onClick={() => handleIncrease(item.productId)}>
                    +
                  </button>
                </div>

                <p className="subtotal">
                  Subtotal: ₹{(item.price * item.quantity)?.toFixed(2) || "0.00"}
                </p>
              </div>

              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.itemId)}
              >
                REMOVE
              </button>
            </div>
          ))}
        </div>

        {/* RIGHT: Price Summary */}
        <div className="cart-right">
          <div className="summary-card">
            <h3>PRICE DETAILS</h3>

            <div className="summary-row">
              <span>Price ({items.length} items)</span>
              <span>₹{subtotal?.toFixed(2) || "0.00"}</span>
            </div>

            <div className="summary-row">
              <span>Delivery Charges</span>
              <span>{shipping > 0 ? `₹${shipping.toFixed(2)}` : "FREE"}</span>
            </div>

            <hr />

            <div className="summary-total">
              <span>Total Amount</span>
              <span>₹{(subtotal + shipping)?.toFixed(2) || "0.00"}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout", { state: { cartId } })}
            >
              PLACE ORDER
            </button>

            <button className="clear-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;