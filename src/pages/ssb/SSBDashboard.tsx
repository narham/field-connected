import { Users, Calendar, CreditCard, TrendingUp, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "Pemain Aktif", value: "48", icon: Users, color: "text-primary" },
  { label: "Latihan Hari Ini", value: "2", icon: Calendar, color: "text-info" },
  { label: "Tagihan Pending", value: "12", icon: CreditCard, color: "text-warning" },
  { label: "Kehadiran Bulan Ini", value: "87%", icon: TrendingUp, color: "text-primary" },
];

const upcomingTraining = [
  { time: "07:00", group: "U-10", location: "Lapangan A" },
  { time: "15:00", group: "U-12", location: "Lapangan B" },
  { time: "16:30", group: "U-14", location: "Lapangan A" },
];

const SSBDashboard = () => {
  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="gradient-primary rounded-b-3xl px-4 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white/70 text-sm">Selamat datang 👋</p>
            <h1 className="text-white text-xl font-bold">SSB Garuda Muda</h1>
          </div>
          <button className="relative w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] text-white flex items-center justify-center font-bold">
              3
            </span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <Card key={s.label} className="bg-white/15 border-white/10 backdrop-blur-sm">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <s.icon className="w-4 h-4 text-white/80" />
                  <span className="text-white/70 text-[11px]">{s.label}</span>
                </div>
                <p className="text-white text-2xl font-bold">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 mt-6 space-y-6">
        {/* Upcoming Training */}
        <div>
          <h2 className="text-foreground font-semibold mb-3">Jadwal Hari Ini</h2>
          <div className="space-y-2">
            {upcomingTraining.map((t, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{t.time}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{t.group}</p>
                    <p className="text-muted-foreground text-xs">{t.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-foreground font-semibold mb-3">Aksi Cepat</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Tambah Pemain", icon: Users },
              { label: "Buat Tagihan", icon: CreditCard },
              { label: "Absensi", icon: Calendar },
            ].map((a) => (
              <Card key={a.label} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-2">
                    <a.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-foreground">{a.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSBDashboard;
