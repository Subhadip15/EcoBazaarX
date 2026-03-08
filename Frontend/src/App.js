import { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import { isAuthenticated, getStoredUser, logout } from "./services/authService";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";

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
          <AppRoutes
            user={user}
            onLoginSuccess={handleLoginSuccess}
            onSignupSuccess={handleSignupSuccess}
            onLogout={handleLogout}
          />

          <Footer />
        </BrowserRouter>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
