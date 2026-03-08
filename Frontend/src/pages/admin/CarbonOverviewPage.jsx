import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

import MainNavbar from "../../components/layout/MainNavbar";
import AdminModuleNav from "../../features/admin/components/AdminModuleNav";
import { getAdminManagementData } from "../../services/insightsService";
import "../../styles/AdminManagement.css";

function CarbonOverviewPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    getAdminManagementData()
      .then((data) => setRows(data.carbonOverview || []))
      .catch(() => setRows([]));
  }, []);

  return (
    <div className="admin-page">
      <MainNavbar />
      <div className="admin-shell">
        <h2>Carbon Data Overview</h2>
        <AdminModuleNav />
        <div className="admin-chart">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="segment" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="totalKg" fill="#1f64a8" name="Total CO2 (kg)" />
              <Bar dataKey="reductionKg" fill="#2d7e4d" name="Reduction (kg)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Segment</th>
              <th>Total CO2 (kg)</th>
              <th>Reduction (kg)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.segment}>
                <td>{row.segment}</td>
                <td>{row.totalKg}</td>
                <td>{row.reductionKg}</td>
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

export default CarbonOverviewPage;
