import { useEffect, useState } from "react";
import MainNavbar from "../../components/layout/MainNavbar";
import AdminModuleNav from "../../features/admin/components/AdminModuleNav";
import { getAdminManagementData } from "../../services/insightsService";
import "../../styles/AdminManagement.css";

function UserManagementPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAdminManagementData()
      .then((data) => setUsers(data.users || []))
      .catch(() => setUsers([]));
  }, []);

  return (
    <div className="admin-page">
      <MainNavbar />
      <div className="admin-shell">
        <h2>User Management</h2>
        <AdminModuleNav />
        <div className="admin-toolbar">
          <input type="text" placeholder="Search users..." />
          <select>
            <option>All Status</option>
            <option>Active</option>
            <option>Suspended</option>
          </select>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!users.length && (
              <tr>
                <td colSpan="6">No users found.</td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`status-pill ${user.status.toLowerCase()}`}>{user.status}</span>
                </td>
                <td>{user.role}</td>
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

export default UserManagementPage;
