import { useEffect, useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Filter, 
  Search, 
  Calendar, 
  Building2, 
  ChevronRight,
  PieChart as PieChartIcon,
  Table as TableIcon,
  Loader2,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const revenueData = [
  { name: 'SPP Bulanan', value: 75 },
  { name: 'Pendaftaran', value: 15 },
  { name: 'Transport/Makan', value: 10 },
];

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b'];

const TreasurerReports = () => {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleExport = (type: string) => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      toast.success(`Laporan ${type} berhasil diunduh.`);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Menyiapkan laporan keuangan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Laporan & Analitik Keuangan</h1>
          <p className="text-xs text-muted-foreground">Analisis cashflow, piutang, dan tren pendapatan.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => handleExport('Excel')} disabled={exporting}>
            <FileSpreadsheet className="w-4 h-4" /> Excel
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => handleExport('PDF')} disabled={exporting}>
            <FileText className="w-4 h-4" /> PDF
          </Button>
        </div>
      </header>

      {/* Reports Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Cashflow Summary */}
        <Card className="shadow-sm border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Cashflow Juni 2026
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-dashed">
              <span className="text-xs text-muted-foreground">Total Pemasukan</span>
              <span className="text-sm font-bold text-emerald-600">Rp 67.400.000</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-dashed">
              <span className="text-xs text-muted-foreground">Total Pengeluaran</span>
              <span className="text-sm font-bold text-rose-600">Rp 42.150.000</span>
            </div>
            <div className="flex justify-between items-center py-2 bg-slate-50 px-3 rounded-lg">
              <span className="text-xs font-bold uppercase tracking-wider">Net Profit</span>
              <span className="text-sm font-black text-primary">Rp 25.250.000</span>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card className="shadow-sm border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-blue-500" /> Sumber Pendapatan (%)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[200px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Piutang (Receivables) Aging */}
        <Card className="shadow-sm border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-amber-500" /> Aging Report (Piutang)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span>Terlambat 0-30 Hari</span>
                <span className="font-bold">Rp 32.500.000</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-[65%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span>Terlambat 31-60 Hari</span>
                <span className="font-bold">Rp 12.500.000</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full w-[25%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px]">
                <span>Terlambat {'>'} 60 Hari</span>
                <span className="font-bold">Rp 5.000.000</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-600 h-full w-[10%]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cashflow Table / Detailed Logs */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> Rincian Transaksi Terbaru
          </h3>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[120px] h-8 text-[10px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="income">Pendapatan</SelectItem>
                <SelectItem value="expense">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Card className="shadow-none border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase tracking-wider border-b">
                <tr>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Deskripsi</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3 text-right">Nominal</th>
                  <th className="px-4 py-3 text-center">Metode</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {[
                  { date: '02 Jun 2026', desc: 'Pembayaran SPP - Budi Santoso', cat: 'Pendapatan', amount: '+ Rp 450.000', method: 'Transfer', type: 'in' },
                  { date: '01 Jun 2026', desc: 'Sewa Lapangan Bulanan', cat: 'Operasional', amount: '- Rp 15.000.000', method: 'Transfer', type: 'out' },
                  { date: '01 Jun 2026', desc: 'Pembelian Bola (10 Unit)', cat: 'Peralatan', amount: '- Rp 2.500.000', method: 'Tunai', type: 'out' },
                  { date: '31 Mei 2026', desc: 'Registrasi Siswa Baru - Siti', cat: 'Pendapatan', amount: '+ Rp 1.200.000', method: 'QRIS', type: 'in' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">{row.date}</td>
                    <td className="px-4 py-3 font-medium">{row.desc}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-[9px] h-4 font-normal">{row.cat}</Badge>
                    </td>
                    <td className={`px-4 py-3 text-right font-bold ${row.type === 'in' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {row.amount}
                    </td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{row.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-slate-50 text-center border-t">
            <Button variant="ghost" size="sm" className="text-[10px] text-primary h-7">Lihat Laporan Lengkap</Button>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default TreasurerReports;
