import { Outlet } from "react-router-dom";
import SSBBottomNav from "./SSBBottomNav";

const SSBLayout = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Outlet />
      <SSBBottomNav />
    </div>
  );
};

export default SSBLayout;
