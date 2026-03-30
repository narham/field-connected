import { Link, useLocation } from "react-router-dom";
import { Home, Users, Calendar, ClipboardCheck, UserCircle } from "lucide-react";

const navItems = [
  { to: "/coach", icon: Home, label: "Home" },
  { to: "/coach/roster", icon: Users, label: "Tim" },
  { to: "/coach/schedule", icon: Calendar, label: "Jadwal" },
  { to: "/coach/attendance", icon: ClipboardCheck, label: "Absen" },
  { to: "/coach/profile", icon: UserCircle, label: "Profil" },
];

const CoachBottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive =
            item.to === "/coach"
              ? location.pathname === "/coach"
              : location.pathname.startsWith(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default CoachBottomNav;
