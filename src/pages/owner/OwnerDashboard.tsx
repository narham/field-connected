import { useEffect, useState } from "react";
import { 
  Users, 
  UserCog, 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Globe,
  ArrowUpRight,
  MoreVertical,
  Activity,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  AreaChart, 
  Area 
} from "recharts";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const mockPerformanceData = [
  { day: 'Sen', players: 120, revenue: 4500000 },
  { day: 'Sel', players: 132, revenue: 5200000 },
  { day: 'Rab', players: 101, revenue: 4800000 },
  { day: 'Kam', players: 134, revenue: 6100000 },
  { day: 'Jum', players: 155, revenue: 5500000 },
  { day: 'Sab', players: 180, revenue: 8700000 },
  { day: 'Min', players: 190, revenue: 9500000 },
];

const OwnerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_members: 245,
    active_staff: 18,
    pending_approvals: 5,
    monthly_revenue: 125400000
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Activity className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Menganalisis performa klub...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Strategic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Strategis</h1>
          <p className="text-sm text-muted-foreground">Pantau kesehatan organisasi dan pertumbuhan klub secara real-time.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-white">
            <FileText className="w-4 h-4 mr-2" /> Laporan Tahunan
          </Button>
          <Button size="sm" asChild>
            <Link to="/owner/approvals">
              <ShieldCheck className="w-4 h-4 mr-2" /> {stats.pending_approvals} Approval Pending
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-none bg-slate-900 text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-16 h-16" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-widest">Pendapatan Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {stats.monthly_revenue.toLocaleString('id-ID')}</div>
            <div className="flex items-center gap-1 mt-2 text-emerald-400 text-[10px] font-bold">
              <ArrowUpRight className="w-3 h-3" /> +18.2% vs Target
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-100 relative overflow-hidden group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Total Anggota Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_members}</div>
            <div className="flex items-center gap-1 mt-2 text-primary text-[10px] font-bold">
              <Users className="w-3 h-3" /> 12 Siswa Baru Minggu Ini
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Staf & Pelatih</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active_staff}</div>
            <div className="flex items-center gap-1 mt-2 text-muted-foreground text-[10px]">
              <UserCog className="w-3 h-3" /> 100% Rasio Kehadiran Staf
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-100 bg-rose-50/50 border-rose-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-rose-600 uppercase tracking-widest">Keputusan Strategis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-700">{stats.pending_approvals}</div>
            <div className="flex items-center gap-1 mt-2 text-rose-600 text-[10px] font-bold">
              <ShieldCheck className="w-3 h-3" /> Menunggu Persetujuan Anda
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Section */}
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 shadow-sm border-slate-100">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold">Analisis Pertumbuhan & Keuangan</CardTitle>
              <CardDescription className="text-[10px]">Trend performa klub dalam 7 hari terakhir.</CardDescription>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="w-4 h-4" /></Button>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockPerformanceData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" name="Pendapatan" stroke="#0f172a" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Line type="monotone" dataKey="players" name="Keaktifan Siswa" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="md:col-span-3 space-y-6">
          <Card className="shadow-sm border-slate-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold">Status Infrastruktur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="flex items-center gap-2"><Globe className="w-3 h-3 text-blue-500" /> Lapangan Utama</span>
                  <Badge className="bg-emerald-500 h-4 text-[8px]">Tersedia</Badge>
                </div>
                <Progress value={85} className="h-1.5" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="flex items-center gap-2"><Building2 className="w-3 h-3 text-amber-500" /> Inventaris Bola</span>
                  <span className="text-slate-500">42/50 Unit</span>
                </div>
                <Progress value={42/50*100} className="h-1.5" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-100 overflow-hidden">
            <CardHeader className="pb-2 bg-slate-50/50">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Approval Terakhir
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {[1, 2].map((i) => (
                  <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-none">Anggaran Turnamen U13</p>
                        <p className="text-[9px] text-muted-foreground mt-1">Disetujui 4 jam yang lalu</p>
                      </div>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                  </div>
                ))}
              </div>
              <div className="p-3 bg-slate-50 text-center border-t">
                <Button variant="ghost" size="sm" className="text-[10px] text-primary h-7 font-bold" asChild>
                  <Link to="/owner/approvals">Lihat Semua Antrean</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Strategic Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" className="h-24 flex-col gap-2 text-xs border-slate-200 hover:border-primary hover:bg-primary/5 group" asChild>
          <Link to="/owner/admins">
            <UserCog className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
            Atur Role Admin
          </Link>
        </Button>
        <Button variant="outline" className="h-24 flex-col gap-2 text-xs border-slate-200 hover:border-primary hover:bg-primary/5 group" asChild>
          <Link to="/owner/policies">
            <FileText className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
            Regulasi & SOP
          </Link>
        </Button>
        <Button variant="outline" className="h-24 flex-col gap-2 text-xs border-slate-200 hover:border-primary hover:bg-primary/5 group" asChild>
          <Link to="/owner/structure">
            <Building2 className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
            Struktur Klub
          </Link>
        </Button>
        <Button variant="outline" className="h-24 flex-col gap-2 text-xs border-slate-200 hover:border-primary hover:bg-primary/5 group" asChild>
          <Link to="/owner/settings">
            <Settings className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
            Legalitas & Akun
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default OwnerDashboard;
