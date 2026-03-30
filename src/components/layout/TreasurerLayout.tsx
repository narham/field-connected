import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Receipt, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut,
  Loader2,
  Building2,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * TreasurerLayout Component
 * 
 * Layout utama untuk modul Bendahara (Treasurer).
 * Menangani guard autentikasi role 'treasurer' dan sidebar navigasi.
 */
const TreasurerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [treasurerName, setTreasurerName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const checkTreasurer = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
          return;
        }

        // Verifikasi apakah user terdaftar sebagai bendahara
        const { data: treasurer, error } = await supabase
          .from("treasurers")
          .select("nama")
          .eq("user_id", session.user.id)
          .single();

        if (error || !treasurer) {
          toast.error("Akses ditolak: Profil Bendahara tidak ditemukan.");
          navigate("/login");
          return;
        }

        setTreasurerName(treasurer.nama);
      } catch (error) {
        console.error("Auth Guard Error:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkTreasurer();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Menyiapkan portal bendahara...</p>
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", path: "/treasurer", icon: LayoutDashboard },
    { label: "Manajemen Invoice", path: "/treasurer/invoices", icon: Receipt },
    { label: "Verifikasi Bayar", path: "/treasurer/payments", icon: CreditCard },
    { label: "Laporan Keuangan", path: "/treasurer/reports", icon: BarChart3 },
    { label: "Pengaturan", path: "/treasurer/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <aside className={cn(
        "bg-white border-r transition-all duration-300 flex flex-col z-30 fixed inset-y-0 lg:relative",
        isSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"
      )}>
        {/* Header Sidebar */}
        <div className="p-6 flex items-center gap-3 border-b overflow-hidden whitespace-nowrap">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">FC</div>
          {isSidebarOpen && (
            <div>
              <h1 className="text-sm font-bold leading-none">Field Connected</h1>
              <p className="text-[10px] text-muted-foreground">Bendahara SSB</p>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group",
                  isActive 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "" : "group-hover:scale-110 transition-transform")} />
                {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar / Logout */}
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className={cn("w-full flex items-center gap-3 justify-start text-slate-600 hover:text-destructive hover:bg-destructive/5", !isSidebarOpen && "px-2")}
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="text-sm font-medium">Keluar Sesi</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Navbar */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="font-bold text-slate-800 hidden sm:block">
              {navItems.find(i => i.path === location.pathname)?.label || "Bendahara"}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold leading-none">{treasurerName}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Sesi Aktif: Bendahara</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border">
              <Building2 className="w-5 h-5 text-slate-500" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default TreasurerLayout;
