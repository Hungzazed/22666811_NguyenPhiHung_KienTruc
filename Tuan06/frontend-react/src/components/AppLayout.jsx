import { Outlet } from "react-router-dom";
import Header from "./Header";

function AppLayout() {
  return (
    <div className="page dashboard-page">
      <Header />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
