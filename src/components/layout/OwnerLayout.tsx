import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  Building2, 
  ShieldCheck, 
  FileText, 
  Settings, 
  LogOut,
  Loader2,
  Menu,
  X,
  Bell,
  ArrowRightLeft,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * OwnerLayout Component
 * 
 * Layout utama untuk modul Pemilik Klub (Owner).
 * Menangani guard autentikasi role 'owner' dan navigasi super admin.
 */
const OwnerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [ownerName, setOwnerName] = useState("");
  const [clubName, setClubName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const checkOwner = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login");
          return;
        }

        // Verifikasi apakah user terdaftar sebagai owner
        const { data: owner, error } = await supabase
          .from("owners")
          .select("nama, clubs(name)")
          .eq("user_id", session.user.id)
          .single();

        if (error || !owner) {
          toast.error("Akses ditolak: Profil Pemilik Klub tidak ditemukan.");
          navigate("/login");
          return;
        }

        setOwnerName(owner.nama);
        setClubName(owner.clubs?.name || "Klub SSB");
      } catch (error) {
        console.error("Auth Guard Error:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkOwner();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Menyiapkan pusat kontrol owner...</p>
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", path: "/owner", icon: LayoutDashboard },
    { label: "Manajemen Admin", path: "/owner/admins", icon: UserCog },
    { label: "Struktur & Tim", path: "/owner/structure", icon: Building2 },
    { label: "Anggota Klub", path: "/owner/members", icon: Users },
    { label: "Approval Keputusan", path: "/owner/approvals", icon: ShieldCheck },
    { label: "Kebijakan & SOP", path: "/owner/policies", icon: FileText },
    { label: "Pengaturan Klub", path: "/owner/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Super Admin Navigation */}
      <aside className={cn(
        "bg-slate-900 text-white transition-all duration-300 flex flex-col z-30 fixed inset-y-0 lg:relative",
        isSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"
      )}>
        {/* Header Sidebar (Owner Branding) */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 overflow-hidden whitespace-nowrap">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 shadow-lg shadow-primary/20">FC</div>
          {isSidebarOpen && (
            <div>
              <h1 className="text-sm font-bold leading-none">{clubName}</h1>
              <p className="text-[10px] text-primary font-medium mt-1 uppercase tracking-widest">Portal Pemilik</p>
            </div>
          )}
        </div>

        {/* Super Admin Menu Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "" : "group-hover:scale-110 transition-transform")} />
                {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                {isActive && isSidebarOpen && (
                  <div className="absolute right-2 w-1 h-5 bg-white/20 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar / Account */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          {isSidebarOpen && (
            <div className="bg-slate-800/50 p-3 rounded-xl mb-2">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter mb-1">Status Lisensi</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[8px] h-4 border-primary text-primary">PREMIUM</Badge>
                <span className="text-[9px] text-slate-400">Aktif s/d 2027</span>
              </div>
            </div>
          )}
          <Button 
            variant="ghost" 
            className={cn("w-full flex items-center gap-3 justify-start text-slate-400 hover:text-rose-400 hover:bg-rose-400/5", !isSidebarOpen && "px-2")}
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="text-sm font-medium">Keluar Sistem</span>}
          </Button>
        </div>
      </aside>

      {/* Main Control Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Control Navbar */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-primary" />
              <h2 className="font-bold text-slate-800 hidden sm:block">
                Pusat Kontrol Pemilik
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 pr-4 border-r hidden md:flex">
              <div className="text-right">
                <p className="text-xs font-bold leading-none">{ownerName}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Akses: Super Admin</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center border shadow-sm">
                <UserCog className="w-5 h-5 text-primary" />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative h-9 w-9 bg-slate-50 border rounded-lg">
                <Bell className="w-4 h-4 text-slate-500" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
              </Button>
            </div>
          </div>
        </header>

        {/* Control Page Content */}
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

export default OwnerLayout;
