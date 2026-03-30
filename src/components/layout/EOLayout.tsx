import { Outlet } from "react-router-dom";
import EOSidebar from "./EOSidebar";

const EOLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <EOSidebar />
      <main className="md:ml-64 p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default EOLayout;
