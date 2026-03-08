// src/components/ProductCatalog.jsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import MainNavbar from "../../components/layout/MainNavbar";
import {
  getProducts,
  deleteProduct,
} from "../../services/productService";
import { getResolvedRole } from "../../services/authService";
import "../../styles/ProductCatalog.css";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [maxPrice, setMaxPrice] = useState("");
  const [maxCO2, setMaxCO2] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

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

  const categoryOptions = useMemo(() => {
    const categories = products
      .map((p) => p?.category)
      .filter(Boolean)
      .map((category) => String(category).trim());
    return ["ALL", ...new Set(categories)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = products.filter((p) => {
      const name = String(p?.name || "").toLowerCase();
      const category = String(p?.category || "").toLowerCase();
      const seller = String(p?.seller || "").toLowerCase();
      const price = Number(p?.price || 0);
      const totalCO2 = Number(p?.carbonData?.totalCO2ePerKg || 0);

      const matchesSearch =
        !normalizedSearch ||
        name.includes(normalizedSearch) ||
        category.includes(normalizedSearch) ||
        seller.includes(normalizedSearch);

      const matchesCategory =
        selectedCategory === "ALL" ||
        String(p?.category || "").toLowerCase() === selectedCategory.toLowerCase();

      const matchesPrice = maxPrice === "" || price <= Number(maxPrice);
      const matchesCO2 = maxCO2 === "" || totalCO2 <= Number(maxCO2);

      return matchesSearch && matchesCategory && matchesPrice && matchesCO2;
    });

    return filtered.sort((a, b) => {
      const priceA = Number(a?.price || 0);
      const priceB = Number(b?.price || 0);
      const co2A = Number(a?.carbonData?.totalCO2ePerKg || 0);
      const co2B = Number(b?.carbonData?.totalCO2ePerKg || 0);
      const nameA = String(a?.name || "");
      const nameB = String(b?.name || "");

      switch (sortBy) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "co2-asc":
          return co2A - co2B;
        case "co2-desc":
          return co2B - co2A;
        case "name-desc":
          return nameB.localeCompare(nameA);
        case "name-asc":
        default:
          return nameA.localeCompare(nameB);
      }
    });
  }, [maxCO2, maxPrice, products, searchTerm, selectedCategory, sortBy]);

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
        <>
          <section className="filters-row">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, category, seller"
              aria-label="Search products"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Filter by category"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category === "ALL" ? "All Categories" : category}
                </option>
              ))}
            </select>
            <input
              type="number"
              min="0"
              step="0.01"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max price"
              aria-label="Maximum price"
            />
            <input
              type="number"
              min="0"
              step="0.01"
              value={maxCO2}
              onChange={(e) => setMaxCO2(e.target.value)}
              placeholder="Max CO2 (kg)"
              aria-label="Maximum CO2"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
            >
              <option value="name-asc">Sort: Name A-Z</option>
              <option value="name-desc">Sort: Name Z-A</option>
              <option value="price-asc">Sort: Price Low-High</option>
              <option value="price-desc">Sort: Price High-Low</option>
              <option value="co2-asc">Sort: CO2 Low-High</option>
              <option value="co2-desc">Sort: CO2 High-Low</option>
            </select>
            <button
              className="text-btn"
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("ALL");
                setMaxPrice("");
                setMaxCO2("");
                setSortBy("name-asc");
              }}
            >
              Reset
            </button>
          </section>

          <section className="product-grid">
            {products.length === 0 && <p>No products available.</p>}
            {products.length > 0 && filteredProducts.length === 0 && (
              <p>No products match the selected filters.</p>
            )}
            {filteredProducts.map((p) => {
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
                    <strong>₹{price.toFixed(2)}</strong>
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
        </>
      )}
    </main>
  );
}

export default ProductCatalog;
