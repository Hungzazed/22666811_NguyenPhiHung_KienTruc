import { Link, NavLink } from 'react-router-dom';

export default function Layout({ auth, onLogout, children }) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <Link className="brand" to="/foods">
          <span className="brand-mark">FD</span>
          <span>
            Food Delivery
            <small>Hybrid Microservices</small>
          </span>
        </Link>

        <nav className="nav">
          <NavLink to="/foods" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Food List
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Order Page
          </NavLink>
          <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Login
          </NavLink>
          <NavLink to="/register" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Register
          </NavLink>
        </nav>

        <div className="auth-card">
          <p className="eyebrow">Session</p>
          {auth?.user ? (
            <>
              <strong>{auth.user.username}</strong>
              <button className="ghost-button" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <p>Login to place an order.</p>
          )}
        </div>
      </aside>

      <main className="content">
        {children}
      </main>
    </div>
  );
}
