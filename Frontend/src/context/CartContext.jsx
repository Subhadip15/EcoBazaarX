// src/context/CartContext.jsx
import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // ✅ Auto calculate subtotal from items
  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }, [items]);

  // ✅ Auto calculate emission
  const totalEmission = useMemo(() => {
    return items.reduce((total, item) => {
      return total + (item.emission || 0) * item.quantity;
    }, 0);
  }, [items]);

  // ================= FETCH CART =================
  const fetchCart = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      setItems(data.items || []);
      setCartId(data.cartId || null);
    } catch (err) {
      console.error("Fetch cart error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  // ================= ADD ITEM =================
  const addToCart = async (productId, quantity) => {
    try {
      await fetch("http://localhost:8080/api/cart/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      });

      fetchCart(); // refresh cart
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  // ================= REMOVE ITEM =================
  const removeFromCart = async (itemId) => {
    try {
      await fetch(`http://localhost:8080/api/cart/remove/${itemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchCart(); // refresh cart
    } catch (err) {
      console.error("Remove error:", err);
    }
  };

  // ================= UPDATE QUANTITY =================
  const updateQuantity = async (productId, change) => {
    try {
      await fetch("http://localhost:8080/api/cart/update", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          quantityChange: change,
        }),
      });

      fetchCart(); // refresh cart
    } catch (err) {
      console.error("Update quantity error:", err);
    }
  };

  // ================= CLEAR CART =================
  const clearCart = async () => {
    try {
      await fetch("http://localhost:8080/api/cart/clear", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setItems([]);
      setCartId(null);
    } catch (err) {
      console.error("Clear cart error:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,       
        totalEmission,   
        cartId,
        loading,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};