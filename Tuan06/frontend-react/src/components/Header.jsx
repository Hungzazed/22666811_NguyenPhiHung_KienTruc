import { NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

function Header() {
  const { currentUser, cartSummary, logout } = useApp();
  const navigate = useNavigate();

  return (
    <header className="topbar app-header">
      <div className="brand-block">
        <div>
          <h2>Mini Food Ordering</h2>
          <p>
            Xin chao, {currentUser?.name}
            <span className="role-chip">{currentUser?.role || "USER"}</span>
          </p>
        </div>
      </div>

      <nav className="app-nav">
        <NavLink to="/foods" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Danh sach mon
        </NavLink>
        <NavLink to="/foods/new" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Them mon
        </NavLink>
        <NavLink to="/checkout" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
          Thanh toan
        </NavLink>
      </nav>

      <div className="cart-summary">
        <div>
          <strong>Gio hang</strong>
          <p>
            {cartSummary.count} mon | {cartSummary.total.toLocaleString()} VND
          </p>
        </div>
        <button type="button" onClick={() => navigate("/checkout")}>Thanh toan</button>
        <button type="button" className="danger" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
