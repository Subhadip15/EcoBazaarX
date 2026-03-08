import { useEffect, useState } from "react";
import MainNavbar from "../../components/layout/MainNavbar";
import AdminModuleNav from "../../features/admin/components/AdminModuleNav";
import { getGreenVerificationData } from "../../services/insightsService";
import "../../styles/AdminManagement.css";

function GreenProductVerification() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    getGreenVerificationData()
      .then((data) => setQueue(data || []))
      .catch(() => setQueue([]));
  }, []);

  return (
    <div className="admin-page">
      <MainNavbar />
      <div className="admin-shell">
        <h2>Green Product Verification</h2>
        <AdminModuleNav />
        <div className="verify-grid">
          {queue.map((item) => (
            <article key={item.id} className="verify-card">
              <div className="verify-head">
                <h3>{item.productName}</h3>
                <span className={`status-pill ${item.status.toLowerCase().replace(" ", "-")}`}>
                  {item.status}
                </span>
              </div>
              <p>
                <strong>Product ID:</strong> {item.id}
              </p>
              <p>
                <strong>Seller:</strong> {item.sellerName}
              </p>
              <p>
                <strong>Category:</strong> {item.category}
              </p>
              <p>
                <strong>Submitted:</strong> {item.submittedAt}
              </p>
              <p>
                <strong>Notes:</strong> {item.notes}
              </p>
              <div className="verify-actions">
                <button type="button">Verify Seller</button>
                <button type="button" className="approve">
                  Approve
                </button>
                <button type="button" className="danger">
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GreenProductVerification;
