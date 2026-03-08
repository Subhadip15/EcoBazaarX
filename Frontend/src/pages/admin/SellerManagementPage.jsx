import { useEffect, useState } from "react";
import MainNavbar from "../../components/layout/MainNavbar";
import AdminModuleNav from "../../features/admin/components/AdminModuleNav";
import { getAdminManagementData } from "../../services/insightsService";
import "../../styles/AdminManagement.css";

function SellerManagementPage() {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    getAdminManagementData()
      .then((data) => setSellers(data.sellers || []))
      .catch(() => setSellers([]));
  }, []);

  return (
    <div className="admin-page">
      <MainNavbar />
      <div className="admin-shell">
        <h2>Seller Management</h2>
        <AdminModuleNav />
        <div className="admin-toolbar">
          <input type="text" placeholder="Search sellers..." />
          <select>
            <option>All Verification</option>
            <option>Verified</option>
            <option>Unverified</option>
          </select>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Seller ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Verified</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller.id}>
                <td>{seller.id}</td>
                <td>{seller.name}</td>
                <td>{seller.category}</td>
                <td>{seller.verified ? "Yes" : "No"}</td>
                <td>{seller.status}</td>
                <td className="actions-cell">
                  <button type="button">View</button>
                  <button type="button">Edit</button>
                  <button type="button" className="danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SellerManagementPage;
