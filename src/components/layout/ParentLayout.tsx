import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Receipt, 
  LineChart, 
  User, 
  LogOut,
  Loader2,
  Home,
  ChevronRight
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/**
 * ParentLayout Component
 * 
 * Layout utama untuk modul Orang Tua/Wali.
 * Menangani guard autentikasi dan navigasi bawah mobile-first.
 */
const ParentLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [parentName, setParentName] = useState("");

  useEffect(() => {
    const checkParent = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
          return;
        }

        // Verifikasi apakah user terdaftar sebagai parent
        const { data: parent, error } = await supabase
          .from("parents")
          .select("nama")
          .eq("user_id", session.user.id)
          .single();

        if (error || !parent) {
          toast.error("Akses ditolak: Profil orang tua tidak ditemukan.");
          navigate("/login");
          return;
        }

        setParentName(parent.nama);
      } catch (error) {
        console.error("Auth Guard Error:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkParent();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Menyiapkan dashboard orang tua...</p>
      </div>
    );
  }

  const navItems = [
    { label: "Home", path: "/parent", icon: Home },
    { label: "Tagihan", path: "/parent/bills", icon: Receipt },
    { label: "Progres", path: "/parent/progress", icon: LineChart },
    { label: "Profil", path: "/parent/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-10 bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">FC</div>
          <div>
            <h1 className="text-xs font-bold leading-none">Field Connected</h1>
            <p className="text-[10px] text-muted-foreground">Portal Orang Tua</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="w-4 h-4 text-muted-foreground" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile First) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t px-2 py-2 flex items-center justify-around z-20">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${
                isActive ? "text-primary bg-primary/5" : "text-muted-foreground hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "fill-primary/10" : ""}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default ParentLayout;
