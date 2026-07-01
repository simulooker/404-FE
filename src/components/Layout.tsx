import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

function Layout() {
  return (
    <div className="app-layout">
      <Outlet />
      <BottomNav />
    </div>
  );
}

export default Layout;
