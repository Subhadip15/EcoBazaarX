// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchCart as fetchCartService,
  addToCart as addToCartService,
  removeFromCart as removeFromCartService,
  clearCart as clearCartService,
  updateQuantity as updateQuantityService,
} from "../services/cartService";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({
    cartId: null,
    userEmail: "",
    items: [],
    totalAmount: 0,
    totalEmission: 0,
  });
  const [loading, setLoading] = useState(false);

  // ================= LOAD CART =================
  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await fetchCartService();
      setCart({
        cartId: data?.cartId || null,
        userEmail: data?.userEmail || "",
        items: data?.items || [],
        totalAmount: data?.totalAmount || 0,
        totalEmission: data?.totalEmission || 0,
      });
    } catch (error) {
      console.error("Failed to fetch cart:", error.message);
      setCart({ cartId: null, userEmail: "", items: [], totalAmount: 0, totalEmission: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ================= ADD TO CART =================
  const addToCart = async (productId, quantity = 1) => {
    try {
      const updatedCart = await addToCartService(productId, quantity);
      setCart({
        cartId: updatedCart?.cartId || null,
        userEmail: updatedCart?.userEmail || "",
        items: updatedCart?.items || [],
        totalAmount: updatedCart?.totalAmount || 0,
        totalEmission: updatedCart?.totalEmission || 0,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error.message);
    }
  };

  // ================= REMOVE ITEM =================
  const removeFromCart = async (itemId) => {
    try {
      const updatedCart = await removeFromCartService(itemId);
      setCart({
        cartId: updatedCart?.cartId || null,
        userEmail: updatedCart?.userEmail || "",
        items: updatedCart?.items || [],
        totalAmount: updatedCart?.totalAmount || 0,
        totalEmission: updatedCart?.totalEmission || 0,
      });
    } catch (error) {
      console.error("Failed to remove item:", error.message);
    }
  };

  // ================= CLEAR CART =================
  const clearCart = async () => {
    try {
      const updatedCart = await clearCartService();
      setCart({
        cartId: updatedCart?.cartId || null,
        userEmail: updatedCart?.userEmail || "",
        items: updatedCart?.items || [],
        totalAmount: updatedCart?.totalAmount || 0,
        totalEmission: updatedCart?.totalEmission || 0,
      });
    } catch (error) {
      console.error("Failed to clear cart:", error.message);
      setCart({ cartId: null, userEmail: "", items: [], totalAmount: 0, totalEmission: 0 });
    }
  };

  // ================= UPDATE QUANTITY =================
  const updateQuantity = async (productId, quantityChange) => {
    try {
      const updatedCart = await updateQuantityService(productId, quantityChange);
      setCart({
        cartId: updatedCart?.cartId || null,
        userEmail: updatedCart?.userEmail || "",
        items: updatedCart?.items || [],
        totalAmount: updatedCart?.totalAmount || 0,
        totalEmission: updatedCart?.totalEmission || 0,
      });
    } catch (error) {
      console.error("Failed to update quantity:", error.message);
    }
  };

  // ================= PROVIDE SAFE DEFAULTS =================
  const contextValue = {
    items: cart.items || [],
    subtotal: cart.totalAmount || 0,
    totalEmission: cart.totalEmission || 0,
    cartId: cart.cartId,
    userEmail: cart.userEmail,
    loading,
    addToCart,
    removeFromCart,
    clearCart,
    fetchCart,
    updateQuantity,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);