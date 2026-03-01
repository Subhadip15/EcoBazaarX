// src/components/ProductCatalog.jsx
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import MainNavbar from "./MainNavbar";
import {
  getProducts,
  deleteProduct,
} from "../services/productService";
import { getResolvedRole } from "../services/authService";
import "../styles/ProductCatalog.css";

function ProductCatalog() {
  const navigate = useNavigate();
  const currentRole = getResolvedRole() || "USER";
  const isAdmin = currentRole === "ADMIN";

  const { items: cartItems = [], addToCart, updateQuantity, removeFromCart } = useCart();
  const totalItems = cartItems.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // ================= LOAD PRODUCTS =================
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setApiError("");
      const data = await getProducts();
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

  // ================= CART FUNCTIONS =================
  const handleAddToCart = async (product) => {
    try {
      const cartItem = cartItems.find((i) => i.productId === product.id);
      if (cartItem) {
        // Already in cart → increase quantity
        await updateQuantity(product.id, 1);
      } else {
        // Not in cart → add
        await addToCart(product.id, 1);
      }
      showToast(`${product.name} added to cart.`, "success");
    } catch (err) {
      showToast("Failed to add item.", "error");
    }
  };

  const handleDecrease = async (product) => {
    const cartItem = cartItems.find((i) => i.productId === product.id);
    if (!cartItem) return;
    if (cartItem.quantity === 1) {
      await removeFromCart(cartItem.itemId);
    } else {
      await updateQuantity(product.id, -1);
    }
  };

  const getCartQuantity = (productId) => {
    return cartItems.find((i) => i.productId === productId)?.quantity || 0;
  };

  // ================= UI =================
  return (
    <main className="catalog-page">
      <MainNavbar />

      <header className="catalog-hero">
        <div>
          <h1>Eco Product Catalog</h1>
          <p>Explore sustainable products with carbon insights.</p>
        </div>
        <div className="actions-row">
          <button onClick={() => navigate("/cart")} className="ghost-btn">
            Cart ({totalItems})
          </button>
        </div>
      </header>

      {apiError && <p className="error-line">{apiError}</p>}

      {loading ? (
        <p className="loading-text">Loading products...</p>
      ) : (
        <section className="product-grid">
          {products.length === 0 && <p>No products available.</p>}
          {products.map((p) => {
            const totalCO2 = Number(p?.carbonData?.totalCO2ePerKg || 0);
            const price = Number(p?.price || 0);
            const quantityInCart = getCartQuantity(p.id);

            return (
              <article key={p.id} className="product-card">
                <img
                  src={
                    p.image ||
                    "https://dummyimage.com/600x400/cccccc/000000&text=EcoBazaar"
                  }
                  alt={p.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://dummyimage.com/600x400/cccccc/000000&text=EcoBazaar";
                  }}
                />

                <div className="product-body">
                  <h3>{p.name || "Unnamed Product"}</h3>
                  <p className="meta-line">
                    {(p.category || "General")} • {(p.seller || "EcoBazaar")}
                  </p>

                  <div className="stats-row">
                    <strong>${price.toFixed(2)}</strong>
                    <span>{totalCO2.toFixed(2)} kg CO2e</span>
                  </div>

                  <div className="card-actions">
                    <Link className="link-btn" to={`/products/${p.id}`}>
                      View Impact
                    </Link>

                    {/* Add to Cart / Quantity Controls */}
                    {quantityInCart > 0 ? (
                      <div className="qty-control">
                        <button
                          className="qty-btn"
                          onClick={() => handleDecrease(p)}
                        >
                          -
                        </button>
                        <span className="qty-value">{quantityInCart}</span>
                        <button
                          className="qty-btn"
                          onClick={() => handleAddToCart(p)}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        className="primary-btn"
                        onClick={() => handleAddToCart(p)}
                      >
                        Add to Cart
                      </button>
                    )}

                    {isAdmin && (
                      <>
                        <button
                          className="text-btn"
                          onClick={() => navigate(`/edit/${p.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-btn"
                          onClick={async () => {
                            try {
                              await deleteProduct(p.id);
                              showToast(`${p.name} deleted.`, "success");
                              loadProducts();
                            } catch (err) {
                              showToast(
                                `Failed to delete ${p.name}.`,
                                "error"
                              );
                            }
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
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