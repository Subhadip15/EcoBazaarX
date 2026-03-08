import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../../components/layout/MainNavbar";
import CartItemCard from "../../features/cart/components/CartItemCard";
import PriceSummarySection from "../../features/cart/components/PriceSummarySection";
import EmissionIndicator from "../../features/cart/components/EmissionIndicator";
import RecommendedProductsSection from "../../features/cart/components/RecommendedProductsSection";
import { getCartRecommendations } from "../../services/insightsService";
import "../../styles/CartPage.css";

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
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    let mounted = true;
    getCartRecommendations()
      .then((data) => {
        if (mounted) setRecommendations(data || []);
      })
      .catch(() => {
        if (mounted) setRecommendations([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

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
            <CartItemCard
              key={item.itemId || item.productId}
              item={item}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={removeFromCart}
            />
          ))}

          <RecommendedProductsSection products={recommendations} />
        </div>

        {/* RIGHT: Price Summary */}
        <div className="cart-right">
          <EmissionIndicator emissionKg={totalEmission} itemCount={items.length} />
          <PriceSummarySection
            itemCount={items.length}
            subtotal={subtotal}
            shipping={shipping}
            onCheckout={() => navigate("/checkout", { state: { cartId } })}
            onClear={clearCart}
          />
        </div>
      </div>
    </div>
  );
}

export default CartPage;
