import { useEffect, useMemo, useState } from "react";
import MainNavbar from "../components/MainNavbar";
import { getStoredUser } from "../services/authService";
import { fetchAllOrdersForAdminApi, fetchOrdersApi } from "../services/orderService";
import { getProducts } from "../services/productService";
import { fetchAdminAnalytics } from "../services/insightsService";
import { buildSalesVsSavings, getTopEcoProducts, groupOrdersByMonth, summarizeFootprint } from "../utils/insights";
import "../styles/CarbonInsights.css";

const reportSections = [
  "EcoBazaarX Carbon Report",
  "Summary: 6 months of tracked footprint and product savings.",
  "Highlights: Lower footprint trend, top eco-friendly products, achievements.",
];

const buildLinePath = (values, width, height, padding) => {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = (width - padding * 2) / (values.length - 1);
  return values
    .map((value, index) => {
      const x = padding + index * stepX;
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
};

const downloadTextFile = (filename, content) => {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

function CarbonInsights({ user }) {
  const storedUser = user || getStoredUser();
  const normalizedRole = String(storedUser?.role || "").toUpperCase();
  const isAdmin = normalizedRole === "ADMIN";
  const isMerchantRole = isAdmin || normalizedRole === "SELLER";
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [adminAnalytics, setAdminAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeView, setActiveView] = useState(
    isMerchantRole ? "merchant" : "user"
  );

  useEffect(() => {
    let isMounted = true;
    const loadInsights = async () => {
      setLoading(true);
      setError("");
      try {
        const [ordersData, productsData, adminReport] = await Promise.all([
          isAdmin ? fetchAllOrdersForAdminApi() : fetchOrdersApi(),
          getProducts(),
          isAdmin ? fetchAdminAnalytics().catch(() => null) : Promise.resolve(null),
        ]);

        if (!isMounted) return;
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
        setAdminAnalytics(adminReport);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || "Failed to load insights data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInsights();
    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  const monthlyFootprint = useMemo(() => groupOrdersByMonth(orders, 6), [orders]);
  const topEcoProducts = useMemo(() => getTopEcoProducts(products, 4), [products]);
  const salesVsSavings = useMemo(() => buildSalesVsSavings(orders, products), [orders, products]);

  const totals = useMemo(() => {
    return summarizeFootprint(monthlyFootprint);
  }, [monthlyFootprint]);

  const values = monthlyFootprint.map((item) => item.value || 0);
  const linePath = buildLinePath(values, 520, 200, 24);
  const maxSavings = Math.max(1, ...topEcoProducts.map((item) => item.emission || 0));

  const achievements = useMemo(() => {
    const orderCount = orders.length;
    const ecoOrders = orders.filter((order) => (order.totalEmission || 0) <= 30).length;
    return [
      {
        title: "Low-Carbon Shopper",
        detail: "Stayed under 30kg CO₂ for 3 months",
        status: ecoOrders >= 3 ? "earned" : "progress",
      },
      {
        title: "Eco Advocate",
        detail: "Placed 5+ eco-friendly orders",
        status: orderCount >= 5 ? "earned" : "progress",
      },
      {
        title: "Circular Champion",
        detail: "Ordered 10+ items across refillable SKUs",
        status: orderCount >= 10 ? "earned" : "locked",
      },
    ];
  }, [orders]);

  const merchantMetrics = useMemo(() => {
    const totalSales = salesVsSavings.reduce((acc, item) => acc + item.sales, 0);
    const totalSavings = salesVsSavings.reduce((acc, item) => acc + item.savings, 0);
    const systemSavings = Number(adminAnalytics?.globalCarbonSaved || 0);
    const greenSkus = products.filter((product) => product.isEcoFriendly).length;
    const repeatRate = orders.length > 0 ? Math.min(100, Math.round((orders.length / 10) * 100)) : 0;

    return [
      { label: "Total Sales", value: `${totalSales}`, delta: "+12%" },
      { label: "Carbon Saved", value: `${(isAdmin ? systemSavings : totalSavings).toFixed(1)} kg`, delta: "+9%" },
      { label: "Green SKUs", value: `${greenSkus}`, delta: "+6%" },
      { label: "Repeat Buyers", value: `${repeatRate}%`, delta: "+3%" },
    ];
  }, [adminAnalytics, isAdmin, orders, products, salesVsSavings]);

  const handleDownloadReport = () => {
    const summary = [
      ...reportSections,
      "",
      `User: ${storedUser?.name || "Eco Shopper"}`,
      `Total Footprint: ${totals.total} kg CO₂`,
      `Average per Month: ${totals.average} kg CO₂`,
      `Best Month: ${totals.bestMonth}`,
      "",
      "Top Eco Products:",
      ...topEcoProducts.map((item) => `- ${item.name}: ${item.emission ?? 0} kg CO₂ saved`),
    ].join("\n");
    const date = new Date().toISOString().slice(0, 10);
    downloadTextFile(`eco-report-${date}.txt`, summary);
  };

  return (
    <>
      <MainNavbar />
      <div className="insights-page">
        <section className="insights-hero">
          <div className="insights-hero-content">
            <p className="hero-tag">Carbon Insights</p>
            <h1>Track impact, unlock achievements, and prove green outcomes.</h1>
            <p>
              A unified view for shoppers and merchants with footprint trends, eco-product
              performance, and downloadable sustainability reports.
            </p>
            <div className="hero-actions">
              <button className="solid-btn" onClick={handleDownloadReport}>
                Download Eco Report
              </button>
              <button className="ghost-btn" onClick={() => setActiveView(activeView === "user" ? "merchant" : "user")}>
                Switch to {activeView === "user" ? "Merchant" : "User"} View
              </button>
            </div>
          </div>
          <div className="insights-hero-panel">
            <div className="impact-card">
              <span>Monthly Avg</span>
              <h3>{totals.average} kg CO₂</h3>
              <p>Best month: {totals.bestMonth}</p>
            </div>
            <div className="impact-card">
              <span>Total Savings</span>
              <h3>148 kg CO₂</h3>
              <p>Estimated against baseline</p>
            </div>
          </div>
        </section>

        <section className="insights-tabs">
          <button
            className={activeView === "user" ? "tab active" : "tab"}
            onClick={() => setActiveView("user")}
          >
            My Insights
          </button>
          <button
            className={activeView === "merchant" ? "tab active" : "tab"}
            onClick={() => setActiveView("merchant")}
          >
            Merchant Analytics
          </button>
        </section>

        {loading && (
          <div className="card">
            <h3>Loading insights...</h3>
            <p>Fetching carbon data and product analytics.</p>
          </div>
        )}

        {!loading && error && (
          <div className="card">
            <h3>Unable to load insights</h3>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && activeView === "user" ? (
          <section className="insights-grid">
            <div className="card chart-card">
              <h3>Monthly Footprint Trend</h3>
              <svg viewBox="0 0 520 200" className="line-chart">
                <path d={linePath} className="line-path" />
              </svg>
              <div className="chart-labels">
                {monthlyFootprint.map((item) => (
                  <span key={item.label}>{item.label}</span>
                ))}
              </div>
            </div>

            <div className="card bar-card">
              <h3>Top Eco-Friendly Products</h3>
              <div className="bar-chart">
                {topEcoProducts.map((item) => (
                  <div key={item.id} className="bar-item">
                    <div
                      className="bar"
                      style={{ height: `${((item.emission || 0) / maxSavings) * 100}%` }}
                    />
                    <span>{item.name}</span>
                    <strong>{(item.emission || 0).toFixed(1)}kg</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="card badge-card">
              <h3>Eco Achievements</h3>
              <div className="badge-list">
                {achievements.map((badge) => (
                  <div key={badge.title} className={`badge ${badge.status}`}>
                    <div>
                      <h4>{badge.title}</h4>
                      <p>{badge.detail}</p>
                    </div>
                    <span className="status">{badge.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : !loading && !error ? (
          <section className="insights-grid">
            <div className="card metric-card">
              <h3>Seller Performance Snapshot</h3>
              <div className="metric-grid">
                {merchantMetrics.map((metric) => (
                  <div key={metric.label} className="metric-tile">
                    <span>{metric.label}</span>
                    <strong>{metric.value}</strong>
                    <em>{metric.delta}</em>
                  </div>
                ))}
              </div>
            </div>

            <div className="card chart-card">
              <h3>Sales vs Carbon Savings</h3>
              <div className="comparison-bars">
                {salesVsSavings.map((item) => (
                  <div key={item.productId} className="comparison-row">
                    <span>{item.name}</span>
                    <div className="comparison-track">
                      <div className="sales" style={{ width: `${Math.min(100, item.sales)}%` }} />
                      <div className="savings" style={{ width: `${Math.min(100, item.savings)}%` }} />
                    </div>
                    <small>{item.sales} sales · {item.savings}kg saved</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="card badge-card">
              <h3>Milestones</h3>
              <div className="badge-list">
                <div className="badge earned">
                  <div>
                    <h4>Verified Green Seller</h4>
                    <p>All SKUs tagged and audited in the last 90 days.</p>
                  </div>
                  <span className="status">earned</span>
                </div>
                <div className="badge progress">
                  <div>
                    <h4>Top 10 Low-Carbon Brand</h4>
                    <p>Maintain 20% lower emissions vs category average.</p>
                  </div>
                  <span className="status">progress</span>
                </div>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}

export default CarbonInsights;
