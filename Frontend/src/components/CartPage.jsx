import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import MainNavbar from "./MainNavbar";
import "../styles/CartPage.css";

function CartPage() {
  const {
    items,
    cartId,
    loading,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  if (loading) return <p>Loading cart...</p>;

  if (!items.length)
    return (
      <div>
        <MainNavbar />
        <p>Your cart is empty 🛒</p>
        <button onClick={() => navigate("/products")}>
          Continue Shopping
        </button>
      </div>
    );

  // ✅ Auto calculate subtotal
  const subtotal = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const shipping = subtotal > 100 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <div className="cart-container">
      <MainNavbar />

      <div className="cart-content">
        {/* LEFT SIDE - ITEMS */}
        <div className="cart-items">
          <h2 className="cart-title">My Shopping Cart</h2>

          {items.map((item) => (
            <div key={item.itemId} className="cart-item-card">
              <img
                src={
                  item.image ||
                  "https://dummyimage.com/120x120/cccccc/000000&text=Product"
                }
                alt={item.productName}
                className="cart-product-img"
              />

              <div className="cart-item-details">
                <h3>{item.productName}</h3>
                <p className="price">₹{item.price}</p>

                <div className="qty-section">
                  <button
                    onClick={() =>
                      item.quantity === 1
                        ? removeFromCart(item.itemId)
                        : updateQuantity(item.productId, -1)
                    }
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item.productId, 1)
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.itemId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE - SUMMARY */}
        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
          </div>

          <hr />

          <div className="summary-row total">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button
            className="checkout-btn"
            onClick={() =>
              navigate("/checkout", { state: { cartId } })
            }
          >
            Proceed to Checkout
          </button>

          <button className="clear-btn" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;