function CartItemCard({ item, onIncrease, onDecrease, onRemove }) {
  const safePrice = item?.price || 0;
  const safeQty = item?.quantity || 0;

  return (
    <div className="cart-card">
      <div className="cart-info">
        <h3 className="product-name">{item?.productName || "Product"}</h3>
        <p className="price">Rs. {safePrice.toFixed(2)}</p>

        <div className="qty-control">
          <button className="qty-btn" onClick={() => onDecrease(item)}>
            -
          </button>
          <span className="qty-value">{safeQty}</span>
          <button className="qty-btn" onClick={() => onIncrease(item?.productId)}>
            +
          </button>
        </div>

        <p className="subtotal">Subtotal: Rs. {(safePrice * safeQty).toFixed(2)}</p>
      </div>

      <button className="remove-btn" onClick={() => onRemove(item?.itemId)}>
        REMOVE
      </button>
    </div>
  );
}

export default CartItemCard;
