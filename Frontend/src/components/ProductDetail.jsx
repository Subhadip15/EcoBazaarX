import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../services/productService";
import "../styles/ProductDetail.css";

function getEcoTone(total) {
  if (total <= 1.5) return "best";
  if (total <= 2.5) return "great";
  if (total <= 3.8) return "good";
  if (total <= 5) return "warn";
  return "risk";
}

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      try {
        const data = await getProductById(productId);
        if (isMounted) {
          setProduct(data);
          setError("");
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to load product.");
          setProduct(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <main className="detail-page">
        <div className="detail-shell">
          <h2>Loading product...</h2>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="detail-page">
        <div className="detail-shell">
          <h2>Product not found</h2>
          {error ? <p>{error}</p> : <p>This item may have been removed.</p>}
          <Link to="/products" className="back-btn">
            Return to catalog
          </Link>
        </div>
      </main>
    );
  }

  const total = Number(product?.carbonData?.totalCO2ePerKg || 0);
  const ecoTone = getEcoTone(total);
  const {
    manufacturing = 0,
    packaging = 0,
    transport = 0,
    handling = 0
  } = product?.carbonData?.breakdown || {};

  return (
    <main className="detail-page">
      <div className="detail-shell">
        <Link to="/products" className="back-btn">
          Back to Product Catalog
        </Link>

        <section className="detail-main">
          <img src={product.image} alt={product.name} />

          <div className="detail-content">
            <div className="head-row">
              <h1>{product.name}</h1>
              <span className={`eco-tag ${ecoTone}`}>{total} CO2e/kg</span>
            </div>
            <p className="subtitle">
              {product.category} | Seller: {product.seller}
            </p>
            <p className="description">{product.description}</p>

            <div className="price-line">${Number(product.price || 0).toFixed(2)}</div>

            <div className="impact-breakdown">
              <h2>Carbon Impact Breakdown</h2>
              <div className="impact-grid">
                <article>
                  <p>Manufacturing</p>
                  <strong>{manufacturing} CO2e/kg</strong>
                </article>
                <article>
                  <p>Packaging</p>
                  <strong>{packaging} CO2e/kg</strong>
                </article>
                <article>
                  <p>Transport</p>
                  <strong>{transport} CO2e/kg</strong>
                </article>
                <article>
                  <p>Handling</p>
                  <strong>{handling} CO2e/kg</strong>
                </article>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default ProductDetail;
