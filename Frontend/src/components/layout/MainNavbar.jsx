import { Link, useLocation } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { getStoredUser } from "../../services/authService";
import "../../styles/MainNavbar.css";

function MainNavbar() {
  const location = useLocation();
  const user = getStoredUser();
  const { items = [] } = useCart();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <nav className="main-nav">
      <div className="main-nav-shell">
        <Link to="/dashboard" className="brand">
          EcoBazaarX
        </Link>
        <div className="main-nav-links">
          <Link className={isActive("/dashboard") ? "active" : ""} to="/dashboard">
            Home
          </Link>
          <Link className={isActive("/products") ? "active" : ""} to="/products">
            Catalog
          </Link>
          <Link className={isActive("/cart") ? "active" : ""} to="/cart">
            Cart ({items.length})
          </Link>
          <Link className={isActive("/checkout") ? "active" : ""} to="/checkout">
            Checkout
          </Link>
          <Link className={isActive("/insights") ? "active" : ""} to="/insights">
            Insights
          </Link>
          <Link className={isActive("/eco-reports") ? "active" : ""} to="/eco-reports">
            Eco Reports
          </Link>
          <Link className={isActive("/seller-analytics") ? "active" : ""} to="/seller-analytics">
            Analytics
          </Link>
          {user?.role === "ADMIN" && (
            <Link className={isActive("/admin") ? "active" : ""} to="/admin/users">
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default MainNavbar;
