import { Link, useLocation } from "react-router-dom";
import { Trophy, Users, CalendarDays, BarChart3, Settings, LogOut, Home } from "lucide-react";

const menuItems = [
  { to: "/eo", icon: Home, label: "Dashboard" },
  { to: "/eo/competitions", icon: Trophy, label: "Kompetisi" },
  { to: "/eo/registrations", icon: Users, label: "Pendaftaran" },
  { to: "/eo/matches", icon: CalendarDays, label: "Pertandingan" },
  { to: "/eo/standings", icon: BarChart3, label: "Klasemen" },
  { to: "/eo/settings", icon: Settings, label: "Pengaturan" },
];

const EOSidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-screen fixed left-0 top-0">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">⚽</span>
          </div>
          <span className="font-bold text-lg text-sidebar-foreground">GrassRoots</span>
        </Link>
        <p className="text-xs text-sidebar-foreground/50 mt-1 ml-10">Event Organizer</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive =
            item.to === "/eo"
              ? location.pathname === "/eo"
              : location.pathname.startsWith(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground w-full transition-colors">
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
};

export default EOSidebar;
