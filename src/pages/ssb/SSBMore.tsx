import { Link } from "react-router-dom";
import { UserCog, Users, Trophy, Settings, LogOut, ChevronRight, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const menuItems = [
  { to: "/ssb/competitions", icon: Trophy, label: "Kompetisi", desc: "Cari & ikuti kompetisi yang tersedia" },
  { to: "/ssb/registrations", icon: ClipboardList, label: "Pendaftaran Saya", desc: "Status pendaftaran tim" },
  { to: "/ssb/coaches", icon: UserCog, label: "Manajemen Pelatih", desc: "Kelola data dan jadwal pelatih" },
  { to: "/ssb/teams", icon: Users, label: "Tim & Kelompok Umur", desc: "Atur pembagian tim" },
  { to: "/ssb/settings", icon: Settings, label: "Pengaturan", desc: "Profil klub dan akun" },
];

const SSBMore = () => {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="text-xl font-bold text-foreground mb-6">Lainnya</h1>

      {/* Profile Card */}
      <Card className="mb-6 gradient-primary border-0">
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-white text-xl font-bold">GM</span>
          </div>
          <div>
            <p className="text-white font-semibold">SSB Garuda Muda</p>
            <p className="text-white/70 text-sm">Admin · Jakarta Selatan</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {menuItems.map((item) => (
          <Link key={item.to} to={item.to}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{item.label}</p>
                  <p className="text-muted-foreground text-xs">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <button className="flex items-center gap-3 w-full mt-6 px-4 py-3 text-destructive text-sm font-medium">
        <LogOut className="w-4 h-4" />
        Keluar dari akun
      </button>
    </div>
  );
};

export default SSBMore;
