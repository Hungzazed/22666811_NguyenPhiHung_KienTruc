import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AppLayout from "./components/AppLayout";
import { AppProvider, useApp } from "./context/AppContext";
import AuthPage from "./pages/AuthPage";
import CheckoutPage from "./pages/CheckoutPage";
import FoodFormPage from "./pages/FoodFormPage";
import FoodsPage from "./pages/FoodsPage";

function ProtectedRoute() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}

function PublicRoute({ children }) {
  const { currentUser } = useApp();

  if (currentUser) {
    return <Navigate to="/foods" replace />;
  }

  return children;
}

function AppRoutes() {
  const { currentUser } = useApp();

  return (
    <Routes>
      <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/foods" replace />} />
          <Route path="/foods" element={<FoodsPage />} />
          <Route path="/foods/new" element={<FoodFormPage mode="create" />} />
          <Route path="/foods/:foodId/edit" element={<FoodFormPage mode="edit" />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to={currentUser ? "/foods" : "/auth"} replace />} />
      <Route path="*" element={<Navigate to={currentUser ? "/foods" : "/auth"} replace />} />
    </Routes>
  );
}

function AppRouter() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={2500} hideProgressBar newestOnTop />
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default AppRouter;
