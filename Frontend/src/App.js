import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import ForgotPassword from "./components/ForgotPassword";
import ProductCatalog from "./components/ProductCatalog";
import ProductDetail from "./components/ProductDetail";
import CartPage from "./components/CartPage";
import CheckoutPage from "./components/CheckoutPage";
import MyOrders from "./components/MyOrders";
import PaymentDemo from "./components/PaymentDemo";
import Footer from "./components/Footer";

import { isAuthenticated, getStoredUser, logout } from "./services/authService";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";

// Helper component for Protected Routes
const ProtectedRoute = ({ user, children, adminOnly = false }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        const storedUser = getStoredUser();
        setUser(storedUser);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = (userData) => setUser(userData);
  const handleSignupSuccess = (userData) => setUser(userData);
  const handleLogout = () => {
    logout();
    setUser(null);
  };

  if (loading) return <div className="loader">Initializing app...</div>;

  return (
    <ToastProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Login onLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Signup onSignupSuccess={handleSignupSuccess} />
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
                  <Dashboard user={user} onLogout={handleLogout} />
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

            {/* Payment Demo for UPI/Card */}
            <Route
              path="/payment-demo"
              element={
                <ProtectedRoute user={user}>
                  <PaymentDemo />
                </ProtectedRoute>
              }
            />

            {/* Default Redirect */}
            <Route
              path="*"
              element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
            />
          </Routes>

          <Footer />
        </BrowserRouter>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;