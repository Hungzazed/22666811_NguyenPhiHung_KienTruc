import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FoodListPage from './pages/FoodListPage';
import OrderPage from './pages/OrderPage';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = JSON.parse(localStorage.getItem('food_delivery_auth') || 'null');

  function handleLogin(payload) {
    localStorage.setItem('food_delivery_auth', JSON.stringify(payload));
    navigate('/foods');
  }

  function handleLogout() {
    localStorage.removeItem('food_delivery_auth');
    navigate('/login');
  }

  const showLayout = location.pathname !== '/login' && location.pathname !== '/register';

  const content = (
    <Routes>
      <Route path="/" element={<Navigate to="/foods" replace />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/foods" element={<FoodListPage />} />
      <Route path="/orders" element={<OrderPage auth={auth} />} />
    </Routes>
  );

  if (!showLayout) {
    return content;
  }

  return (
    <Layout auth={auth} onLogout={handleLogout}>
      {content}
    </Layout>
  );
}
