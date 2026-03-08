function PriceSummarySection({ itemCount, subtotal, shipping, onCheckout, onClear }) {
  const finalTotal = subtotal + shipping;

  return (
    <div className="summary-card">
      <h3>PRICE DETAILS</h3>

      <div className="summary-row">
        <span>Price ({itemCount} items)</span>
        <span>Rs. {subtotal.toFixed(2)}</span>
      </div>

      <div className="summary-row">
        <span>Delivery Charges</span>
        <span>{shipping > 0 ? `Rs. ${shipping.toFixed(2)}` : "FREE"}</span>
      </div>

      <hr />

      <div className="summary-total">
        <span>Total Amount</span>
        <span>Rs. {finalTotal.toFixed(2)}</span>
      </div>

      <button className="checkout-btn" onClick={onCheckout}>
        PLACE ORDER
      </button>

      <button className="clear-btn" onClick={onClear}>
        Clear Cart
      </button>
    </div>
  );
}

export default PriceSummarySection;
