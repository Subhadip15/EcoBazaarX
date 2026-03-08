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
  BarChart,
  Bar,
} from "recharts";

import MainNavbar from "../../components/layout/MainNavbar";
import { getCarbonInsightsData } from "../../services/insightsService";
import "../../styles/Insights.css";

function CarbonInsightsDashboard() {
  const [data, setData] = useState({
    monthlyFootprintTrend: [],
    topEcoFriendlyProducts: [],
    ecoBadges: [],
    stats: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getCarbonInsightsData()
      .then((res) => {
        if (mounted) setData(res);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="insights-page">
      <MainNavbar />
      <div className="insights-shell">
        <div className="insights-head">
          <h2>Carbon Insights and Reporting Dashboard</h2>
          <p>Frontend-only visualization with mock data for backend-ready integration.</p>
        </div>

        {loading ? (
          <p className="loading-row">Loading insights...</p>
        ) : (
          <>
            <section className="stats-grid">
              {data.stats.map((stat) => (
                <article className="stat-card" key={stat.label}>
                  <p>{stat.label}</p>
                  <h3>{stat.value}</h3>
                </article>
              ))}
            </section>

            <section className="badges-grid">
              {data.ecoBadges.map((badge) => (
                <article className="badge-card" key={badge.id}>
                  <h4>{badge.title}</h4>
                  <p>{badge.achieved ? "Achieved" : `Progress: ${badge.progress}%`}</p>
                  <div className="progress-track">
                    <div style={{ width: `${badge.progress}%` }} className="progress-value" />
                  </div>
                </article>
              ))}
            </section>

            <section className="charts-grid">
              <article className="chart-card">
                <h3>Monthly Carbon Footprint Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.monthlyFootprintTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="footprintKg" stroke="#2d7e4d" strokeWidth={2} />
                    <Line type="monotone" dataKey="targetKg" stroke="#6b7f72" strokeDasharray="6 4" />
                  </LineChart>
                </ResponsiveContainer>
              </article>

              <article className="chart-card">
                <h3>Top Eco-Friendly Products</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.topEcoFriendlyProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="savedKg" fill="#2d7e4d" name="CO2 Saved (kg)" />
                  </BarChart>
                </ResponsiveContainer>
              </article>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default CarbonInsightsDashboard;
