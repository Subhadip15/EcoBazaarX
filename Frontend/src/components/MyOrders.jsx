import { useEffect, useState } from "react";
import MainNavbar from "./MainNavbar";
import "../styles/MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(stored.reverse());
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
                  <p><strong>Placed On:</strong> {order.createdAt}</p>
                  <p><strong>Payment:</strong> {order.paymentMethod.toUpperCase()}</p>
                  <p><strong>Total Paid:</strong> ${order.total.toFixed(2)}</p>
                  <p><strong>Estimated CO2:</strong> {order.totalEmission.toFixed(2)} kg CO2e</p>
                </div>

                <div className="order-items">
                  <h4>Items:</h4>
                  {order.items.map((item) => (
                    <div key={item.id} className="item-row">
                      <div className="item-img">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <span className="item-name">{item.name}</span>
                      <span>× {item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
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