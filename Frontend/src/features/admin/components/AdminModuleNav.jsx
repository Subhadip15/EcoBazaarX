import { NavLink } from "react-router-dom";

function AdminModuleNav() {
  const navClass = ({ isActive }) =>
    `admin-nav-link${isActive ? " active" : ""}`;

  return (
    <nav className="admin-module-nav">
      <p className="admin-nav-title">Admin Modules</p>
      <NavLink className={navClass} to="/admin/users">
        Users
      </NavLink>
      <NavLink className={navClass} to="/admin/sellers">
        Sellers
      </NavLink>
      <NavLink className={navClass} to="/admin/products">
        Products
      </NavLink>
      <NavLink className={navClass} to="/admin/carbon-overview">
        Carbon Overview
      </NavLink>
      <NavLink className={navClass} to="/admin/verification">
        Verification
      </NavLink>
    </nav>
  );
}

export default AdminModuleNav;
