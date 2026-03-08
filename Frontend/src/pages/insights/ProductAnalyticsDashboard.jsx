import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import MainNavbar from "../../components/layout/MainNavbar";
import { getSellerProductAnalytics } from "../../services/insightsService";
import "../../styles/Insights.css";
import "../../styles/AdminManagement.css";

function ProductAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState({
    salesVsSavings: [],
    productPerformance: [],
  });

  useEffect(() => {
    getSellerProductAnalytics().then((data) => setAnalytics(data));
  }, []);

  return (
    <div className="insights-page">
      <MainNavbar />
      <div className="insights-shell">
        <div className="insights-head">
          <h2>Product Analytics Dashboard</h2>
          <p>Seller/Admin visual analytics built with mock data only.</p>
        </div>

        <section className="chart-card">
          <h3>Sales vs Carbon Savings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.salesVsSavings}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#1f64a8" strokeWidth={2} />
              <Line type="monotone" dataKey="carbonSavingsKg" stroke="#2d7e4d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="table-card">
          <h3>Product Performance Statistics</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Units Sold</th>
                <th>Rating</th>
                <th>CO2 Savings (kg)</th>
              </tr>
            </thead>
            <tbody>
              {analytics.productPerformance.map((row) => (
                <tr key={row.sku}>
                  <td>{row.sku}</td>
                  <td>{row.product}</td>
                  <td>{row.unitsSold}</td>
                  <td>{row.rating}</td>
                  <td>{row.savingsKg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default ProductAnalyticsDashboard;
