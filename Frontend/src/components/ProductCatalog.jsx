import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainNavbar from "./MainNavbar";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import "../styles/ProductCatalog.css";

function ProductCatalog() {
  const navigate = useNavigate();
  const { items: cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setApiError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const getCartQuantity = (productId) => {
    return cartItems.find((i) => i.productId === productId)?.quantity || 0;
  };

  const handleAddToCart = async (product) => {
    try {
      const qty = getCartQuantity(product.id);
      if (qty) await updateQuantity(product.id, 1);
      else await addToCart(product.id, 1);
      showToast(`${product.name} added to cart.`, "success");
    } catch {
      showToast("Failed to add item.", "error");
    }
  };

  const handleDecrease = async (product) => {
    const cartItem = cartItems.find((i) => i.productId === product.id);
    if (!cartItem) return;
    if (cartItem.quantity === 1) await removeFromCart(cartItem.itemId);
    else await updateQuantity(product.id, -1);
  };

  return (
    <main className="catalog-page">
      <MainNavbar />
      {apiError && <p className="error-line">{apiError}</p>}
      {loading ? (
        <p className="loading-text">Loading products...</p>
      ) : (
        <section className="product-grid">
          {products.map((p) => {
            const quantityInCart = getCartQuantity(p.id);
            return (
              <article key={p.id} className="product-card">
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://dummyimage.com/600x400/cccccc/000000&text=EcoBazaar")
                  }
                />
                <div className="product-body">
                  <h3>{p.name}</h3>
                  <p>{p.category}</p>
                  <strong>${p.price.toFixed(2)}</strong>
                  {quantityInCart > 0 ? (
                    <div className="qty-control">
                      <button onClick={() => handleDecrease(p)}>-</button>
                      <span>{quantityInCart}</span>
                      <button onClick={() => handleAddToCart(p)}>+</button>
                    </div>
                  ) : (
                    <button onClick={() => handleAddToCart(p)}>Add to Cart</button>
                  )}
                  <Link to={`/products/${p.id}`}>View Impact</Link>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}

export default ProductCatalog;