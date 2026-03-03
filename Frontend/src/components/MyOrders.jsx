import { useEffect, useState } from "react";
import MainNavbar from "./MainNavbar";
import "../styles/MyOrders.css"; // Ensure you create this CSS file

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch("http://localhost:8080/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        // Assuming data is an array, reverse it to show newest first
        setOrders(Array.isArray(data) ? data.reverse() : []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div className="orders-page-wrapper">
      <MainNavbar />
      
      <main className="orders-content">
        <h2 className="page-title">My Orders</h2>

        {loading ? (
          <div className="state-msg">
            <div className="loader"></div>
            <p>Fetching your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="state-msg empty-state">
            <img 
              src="https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d405a711-2197-46a5-8042-70077ec9f5a9.png?q=90" 
              alt="Empty Cart" 
              style={{ width: '200px', marginBottom: '20px' }}
            />
            <p>You have no orders yet.</p>
            <button className="shop-now-btn" onClick={() => window.location.href='/products'}>
              Shop Now
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <section key={order.orderId || order._id} className="order-card">
                <header className="order-card-header">
                  <div className="order-id-group">
                    <span className="label">ORDER ID:</span>
                    <span className="id-value">#{order.orderNumber || (order.orderId || order._id).slice(-8).toUpperCase()}</span>
                  </div>
                  <div className={`status-pill ${order.status?.toLowerCase()}`}>
                    {order.status || "Processing"}
                  </div>
                </header>

                <div className="order-body">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <div className="item-main-info">
                        <p className="item-name">{item.productName}</p>
                        <p className="item-qty">Qty: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <footer className="order-card-footer">
                  <div className="order-date">
                    Placed on: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="order-total-summary">
                    Total Amount: <strong>${order.total?.toFixed(2)}</strong>
                  </div>
                </footer>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyOrders;