import { Navigate, Route, Routes } from "react-router-dom";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Dashboard from "../pages/shop/Dashboard";
import ProductCatalog from "../pages/shop/ProductCatalog";
import ProductDetail from "../pages/shop/ProductDetail";
import CartPage from "../pages/shop/CartPage";
import CheckoutPage from "../pages/shop/CheckoutPage";
import MyOrders from "../pages/shop/MyOrders";
import PaymentDemo from "../pages/shop/PaymentDemo";
import CarbonInsightsDashboard from "../pages/insights/CarbonInsightsDashboard";
import EcoReports from "../pages/insights/EcoReports";
import ProductAnalyticsDashboard from "../pages/insights/ProductAnalyticsDashboard";
import UserManagementPage from "../pages/admin/UserManagementPage";
import SellerManagementPage from "../pages/admin/SellerManagementPage";
import ProductManagementPage from "../pages/admin/ProductManagementPage";
import CarbonOverviewPage from "../pages/admin/CarbonOverviewPage";
import GreenProductVerification from "../pages/admin/GreenProductVerification";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = ({ user, onLoginSuccess, onSignupSuccess, onLogout }) => (
  <Routes>
    {/* Public Routes */}
    <Route
      path="/login"
      element={
        user ? <Navigate to="/dashboard" replace /> : <Login onLoginSuccess={onLoginSuccess} />
      }
    />
    <Route
      path="/signup"
      element={
        user ? (
          <Navigate to="/dashboard" replace />
        ) : (
          <Signup onSignupSuccess={onSignupSuccess} />
        )
      }
    />
    <Route
      path="/forgot-password"
      element={user ? <Navigate to="/dashboard" replace /> : <ForgotPassword />}
    />

    {/* Protected Routes */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute user={user}>
          <Dashboard user={user} onLogout={onLogout} />
        </ProtectedRoute>
      }
    />
    <Route
      path="/products"
      element={
        <ProtectedRoute user={user}>
          <ProductCatalog />
        </ProtectedRoute>
      }
    />
    <Route
      path="/products/:id"
      element={
        <ProtectedRoute user={user}>
          <ProductDetail />
        </ProtectedRoute>
      }
    />
    <Route
      path="/cart"
      element={
        <ProtectedRoute user={user}>
          <CartPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/checkout"
      element={
        <ProtectedRoute user={user}>
          <CheckoutPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/my-orders"
      element={
        <ProtectedRoute user={user}>
          <MyOrders />
        </ProtectedRoute>
      }
    />
    <Route
      path="/payment-demo"
      element={
        <ProtectedRoute user={user}>
          <PaymentDemo />
        </ProtectedRoute>
      }
    />
    <Route
      path="/insights"
      element={
        <ProtectedRoute user={user}>
          <CarbonInsightsDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/eco-reports"
      element={
        <ProtectedRoute user={user}>
          <EcoReports />
        </ProtectedRoute>
      }
    />
    <Route
      path="/seller-analytics"
      element={
        <ProtectedRoute user={user}>
          <ProductAnalyticsDashboard />
        </ProtectedRoute>
      }
    />

    {/* Admin Routes */}
    <Route
      path="/admin/users"
      element={
        <ProtectedRoute user={user} isAdmin>
          <UserManagementPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/sellers"
      element={
        <ProtectedRoute user={user} isAdmin>
          <SellerManagementPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/products"
      element={
        <ProtectedRoute user={user} isAdmin>
          <ProductManagementPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/carbon-overview"
      element={
        <ProtectedRoute user={user} isAdmin>
          <CarbonOverviewPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/verification"
      element={
        <ProtectedRoute user={user} isAdmin>
          <GreenProductVerification />
        </ProtectedRoute>
      }
    />

    {/* Default Redirect */}
    <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
  </Routes>
);

export default AppRoutes;
