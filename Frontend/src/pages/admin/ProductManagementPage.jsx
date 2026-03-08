import { useEffect, useState } from "react";
import MainNavbar from "../../components/layout/MainNavbar";
import AdminModuleNav from "../../features/admin/components/AdminModuleNav";
import { getAdminManagementData } from "../../services/insightsService";
import "../../styles/AdminManagement.css";

function ProductManagementPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getAdminManagementData()
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="admin-page">
      <MainNavbar />
      <div className="admin-shell">
        <h2>Product Management</h2>
        <AdminModuleNav />
        <div className="admin-toolbar">
          <input type="text" placeholder="Search products..." />
          <select>
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Seller</th>
              <th>Status</th>
              <th>Eco Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.seller}</td>
                <td>{product.status}</td>
                <td>{product.score}</td>
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

export default ProductManagementPage;
