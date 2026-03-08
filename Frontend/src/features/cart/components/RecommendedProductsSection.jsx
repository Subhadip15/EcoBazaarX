function RecommendedProductsSection({ products = [] }) {
  if (!products.length) return null;

  return (
    <section className="recommended-section">
      <div className="section-head">
        <h3>Alternative Eco-Friendly Picks</h3>
        <p>Mock recommendations for backend-ready UI integration.</p>
      </div>

      <div className="recommendation-grid">
        {products.map((product) => (
          <article className="recommendation-card" key={product.id}>
            <h4>{product.name}</h4>
            <p>Score: {Number(product.score || 0).toFixed(2)}</p>
            <div className="recommend-meta">
              <span>Rs. {Number(product.estimatedPrice || 0).toFixed(2)}</span>
              <span>{Number(product.carbonFootprint || 0).toFixed(2)} kg CO2</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default RecommendedProductsSection;
