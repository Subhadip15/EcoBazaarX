import { useEffect, useState } from "react";
import MainNavbar from "../../components/layout/MainNavbar";
import { fetchOrdersApi } from "../../services/orderService";
import "../../styles/MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    let mounted = true;

    fetchOrdersApi()
      .then((data) => {
        if (mounted) {
          const list = Array.isArray(data) ? data : [];
          setOrders([...list].reverse());
        }
      })
      .catch(() => {
        if (mounted) setOrders([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "PLACED":
        return "status-placed";
      case "PENDING":
        return "status-pending";
      case "CANCELLED":
        return "status-cancelled";
      default:
        return "";
    }
  };

  return (
    <main className="my-orders-page">
      <MainNavbar />
      <section className="orders-shell">
        <h1>My Orders</h1>

        {orders.length === 0 ? (
          <p className="no-orders">You have not placed any orders yet.</p>
        ) : (
          orders.map((order) => (
            <div key={order.orderId} className="order-card">
              <div className="order-header">
                <h3>Order ID: {order.orderId}</h3>
                <span className={`order-status ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-details">
                <div className="order-meta">
                  <p><strong>Placed On:</strong> {order.orderDate || "-"}</p>
                  <p><strong>Payment:</strong> {String(order.paymentMethod || "-").toUpperCase()}</p>
                  <p><strong>Total Paid:</strong> ₹{Number(order.totalAmount || 0).toFixed(2)}</p>
                  <p><strong>Estimated CO2:</strong> {Number(order.totalEmission || 0).toFixed(2)} kg CO2e</p>
                </div>

                <div className="order-items">
                  <h4>Items:</h4>
                  {(order.items || []).map((item) => (
                    <div key={`${item.productId}-${item.productName}`} className="item-row">
                      <span className="item-name">{item.productName}</span>
                      <span>× {item.quantity}</span>
                      <span>₹{Number(item.subtotal || 0).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}

export default MyOrders;
