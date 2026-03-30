import { useEffect, useState } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Receipt, 
  CreditCard, 
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Wallet
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar 
} from "recharts";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const mockTrendData = [
  { month: 'Jan', revenue: 45000000, expenses: 32000000 },
  { month: 'Feb', revenue: 52000000, expenses: 34000000 },
  { month: 'Mar', revenue: 48000000, expenses: 38000000 },
  { month: 'Apr', revenue: 61000000, expenses: 40000000 },
  { month: 'Mei', revenue: 55000000, expenses: 42000000 },
  { month: 'Jun', revenue: 67000000, expenses: 45000000 },
];

const TreasurerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_revenue: 328000000,
    total_receivables: 45000000,
    active_invoices: 124,
    pending_verifications: 12
  });

  useEffect(() => {
    // In real implementation, fetch from Supabase
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Memuat data analitik...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ringkasan Keuangan</h1>
          <p className="text-sm text-muted-foreground">Status keuangan SSB periode Juni 2026.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/treasurer/reports">Ekspor Laporan</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/treasurer/invoices">Generate Tagihan</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Pendapatan</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {stats.total_revenue.toLocaleString('id-ID')}</div>
            <p className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
              <ArrowUpRight className="w-3 h-3" /> +12.5% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Piutang (Receivables)</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">Rp {stats.total_receivables.toLocaleString('id-ID')}</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">
              Dari {stats.active_invoices} invoice aktif
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Verifikasi Pending</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.pending_verifications}</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">
              Perlu approval bendahara
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Saldo Kas</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Wallet className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 182.400.000</div>
            <p className="text-[10px] text-muted-foreground mt-1 font-medium">
              Terakhir sinkron: 10m lalu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Trend Pendapatan vs Pengeluaran</CardTitle>
            <CardDescription className="text-xs">Statistik 6 bulan terakhir.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTrendData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp${value/1000000}jt`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`Rp ${value.toLocaleString('id-ID')}`, '']}
                />
                <Area type="monotone" dataKey="revenue" name="Pendapatan" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" name="Pengeluaran" stroke="#94a3b8" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle className="text-sm font-bold">Status Pembayaran SPP</CardTitle>
            <CardDescription className="text-xs">Bulan berjalan (Juni 2026)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Terbayar (Lunas)</span>
                <span className="font-bold">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Sudah Bayar</p>
                <p className="text-lg font-bold text-emerald-600">192</p>
                <p className="text-[9px] text-muted-foreground">Siswa</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Belum Bayar</p>
                <p className="text-lg font-bold text-amber-600">54</p>
                <p className="text-[9px] text-muted-foreground">Siswa</p>
              </div>
            </div>

            <Button variant="outline" className="w-full text-xs" asChild>
              <Link to="/treasurer/invoices">Lihat Detail Invoice <ChevronRight className="w-3 h-3 ml-2" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <section className="space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2 px-1">
          <Clock className="w-4 h-4 text-primary" /> Aktivitas Keuangan Terbaru
        </h3>
        <Card className="shadow-none border-slate-100 overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-none">Pembayaran Terverifikasi</p>
                      <p className="text-xs text-muted-foreground mt-1">Siswa: Budi Santoso • SPP Juni 2026</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">Rp 350.000</p>
                    <p className="text-[10px] text-muted-foreground mt-1">2 jam yang lalu</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-3 bg-slate-50 text-center border-t">
            <Button variant="ghost" size="sm" className="text-xs text-primary font-medium" asChild>
              <Link to="/treasurer/reports">Lihat Semua Riwayat</Link>
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default TreasurerDashboard;

import { Loader2 } from "lucide-react";
