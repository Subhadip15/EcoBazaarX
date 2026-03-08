import { API_BASE_URL } from "../config/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(auth ? getAuthHeaders() : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message || data?.error || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

function monthKey(dateValue) {
  const d = new Date(dateValue);
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function monthLabelFromKey(key) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month, 1).toLocaleString("en-US", { month: "short" });
}

function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export async function getCartRecommendations() {
  const cart = await request("/api/cart", { auth: true });
  const firstProductId = cart?.items?.[0]?.productId;
  if (!firstProductId) return [];

  const recommendations = await request("/api/recommendations", {
    method: "POST",
    auth: true,
    body: { productId: firstProductId },
  });

  return (recommendations || []).map((item) => ({
    id: item.productId,
    name: item.productName,
    estimatedPrice: toNumber(item.price),
    carbonFootprint: item.carbonFootprint,
    score: item.score,
  }));
}

export async function getCarbonInsightsData() {
  const [orders, products] = await Promise.all([
    request("/api/orders", { auth: true }).catch(() => []),
    request("/api/products").catch(() => []),
  ]);

  const monthlyMap = new Map();
  (orders || []).forEach((order) => {
    if (!order?.orderDate) return;
    const key = monthKey(order.orderDate);
    const curr = monthlyMap.get(key) || 0;
    monthlyMap.set(key, curr + toNumber(order.totalEmission));
  });

  const monthlyFootprintTrend = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .slice(-6)
    .map(([key, emission]) => ({
      month: monthLabelFromKey(key),
      footprintKg: Number(emission.toFixed(2)),
      targetKg: Number((emission * 0.9).toFixed(2)),
    }));

  const topEcoFriendlyProducts = (products || [])
    .filter((p) => p?.isEcoFriendly === true)
    .map((p) => ({
      name: p.name,
      savedKg: Number((5 - toNumber(p?.carbonData?.totalCO2ePerKg)).toFixed(2)),
    }))
    .sort((a, b) => b.savedKg - a.savedKg)
    .slice(0, 5);

  const totalEmission = (orders || []).reduce(
    (sum, o) => sum + toNumber(o.totalEmission),
    0
  );
  const totalOrders = (orders || []).length;
  const averageEmission = totalOrders ? totalEmission / totalOrders : 0;
  const greenScore = Math.max(0, Math.min(100, 100 - averageEmission * 10));

  const ecoBadges = [
    {
      id: "b1",
      title: "First Eco Order",
      progress: totalOrders > 0 ? 100 : 0,
      achieved: totalOrders > 0,
    },
    {
      id: "b2",
      title: "10 Orders Milestone",
      progress: Math.min(100, Math.round((totalOrders / 10) * 100)),
      achieved: totalOrders >= 10,
    },
    {
      id: "b3",
      title: "Low Emission Avg (< 2kg)",
      progress: averageEmission === 0 ? 0 : averageEmission < 2 ? 100 : 50,
      achieved: averageEmission > 0 && averageEmission < 2,
    },
  ];

  return {
    monthlyFootprintTrend,
    topEcoFriendlyProducts,
    ecoBadges,
    stats: [
      { label: "Total CO2 Emission", value: `${totalEmission.toFixed(2)} kg` },
      { label: "Total Orders", value: String(totalOrders) },
      { label: "Eco Products", value: String((products || []).filter((p) => p?.isEcoFriendly).length) },
      { label: "Green Score", value: `${greenScore.toFixed(0)}/100` },
    ],
  };
}

export async function getEcoReportSummary() {
  const orders = await request("/api/orders", { auth: true });

  const totalOrders = (orders || []).length;
  const footprintKg = (orders || []).reduce(
    (sum, o) => sum + toNumber(o.totalEmission),
    0
  );
  const baseline = totalOrders * 5;
  const savingsKg = Math.max(0, baseline - footprintKg);

  return {
    reportMonth: new Date().toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    }),
    totalOrders,
    footprintKg: Number(footprintKg.toFixed(2)),
    savingsKg: Number(savingsKg.toFixed(2)),
    topCategory: "N/A",
    status: "Ready",
  };
}

export async function getSellerProductAnalytics() {
  return {
    available: false,
    message:
      "Seller analytics endpoint is not implemented in backend yet.",
    salesVsSavings: [],
    productPerformance: [],
  };
}

export async function getAdminManagementData() {
  const [users, stats] = await Promise.all([
    request("/api/admin/users", { auth: true }),
    request("/api/admin/stats", { auth: true }),
  ]);

  return {
    users: (users || []).map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      status: "Active",
      role: u.role,
    })),
    stats,
    sellers: [],
    products: [],
    carbonOverview: [],
  };
}

export async function getGreenVerificationData() {
  return [];
}
