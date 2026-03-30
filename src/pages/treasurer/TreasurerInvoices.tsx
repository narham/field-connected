import { useEffect, useState } from "react";
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Send, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  MoreVertical,
  ChevronRight,
  FileText,
  Loader2,
  Calendar,
  Building2,
  Users
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { generateBatchInvoices } from "@/services/financialService";

interface Invoice {
  id: string;
  invoice_number: string;
  player_id: string;
  players: { nama: string };
  periode: string;
  total_nominal: number;
  status: 'unpaid' | 'paid' | 'overdue' | 'cancelled';
  due_date: string;
}

const TreasurerInvoices = () => {
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // In real implementation, fetch from 'invoices' table
      // Mocking for now as we just created the table
      const mockInvoices: Invoice[] = [
        {
          id: '1',
          invoice_number: 'INV/202606/001',
          player_id: 'p1',
          players: { nama: 'Budi Santoso' },
          periode: '06-2026',
          total_nominal: 450000,
          status: 'unpaid',
          due_date: '2026-06-15'
        },
        {
          id: '2',
          invoice_number: 'INV/202606/002',
          player_id: 'p2',
          players: { nama: 'Andi Wijaya' },
          periode: '06-2026',
          total_nominal: 350000,
          status: 'paid',
          due_date: '2026-06-15'
        }
      ];
      setInvoices(mockInvoices);
    } catch (error) {
      console.error("Fetch Invoices Error:", error);
      toast.error("Gagal memuat data invoice.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleBatchGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Simulate batch processing via service
      const result = await generateBatchInvoices("06-2026", user.id);
      
      if (result.success) {
        toast.success(`Batch billing berhasil diproses. ${result.count} invoice baru telah dibuat.`);
        fetchInvoices();
      }
    } catch (error) {
      console.error("Batch Generate Error:", error);
      toast.error("Gagal memproses batch billing.");
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-[10px]">Lunas</Badge>;
      case 'unpaid': return <Badge variant="secondary" className="text-[10px]">Belum Bayar</Badge>;
      case 'overdue': return <Badge variant="destructive" className="text-[10px]">Terlambat</Badge>;
      default: return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Manajemen Invoice</h1>
          <p className="text-xs text-muted-foreground">Kelola tagihan bulanan siswa SSB.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Ekspor Excel
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Invoice Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Generate Invoice Masal</DialogTitle>
                <DialogDescription>
                  Sistem akan membuat tagihan otomatis untuk seluruh pemain aktif di periode terpilih.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Periode Tagihan</Label>
                  <Select defaultValue="06-2026">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Periode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="06-2026">Juni 2026</SelectItem>
                      <SelectItem value="07-2026">Juli 2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Kategori Pemain</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Semua Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori (U9-U17)</SelectItem>
                      <SelectItem value="u9">U9 (Junior)</SelectItem>
                      <SelectItem value="u17">U17 (Pro)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button className="w-full" disabled={isGenerating} onClick={handleBatchGenerate}>
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Calendar className="w-4 h-4 mr-2" />}
                  Proses Batch Billing
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters & Search */}
      <Card className="shadow-none border-slate-100 bg-white">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari nomor invoice atau nama pemain..." 
              className="pl-10 h-10 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px] h-10 text-sm">
                <Filter className="w-3 h-3 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="paid">Lunas</SelectItem>
                <SelectItem value="unpaid">Belum Bayar</SelectItem>
                <SelectItem value="overdue">Terlambat</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Invoice List Table (Responsive Card Style for Mobile, Table for Desktop) */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-sm">Memuat daftar invoice...</p>
          </div>
        ) : invoices.length === 0 ? (
          <Card className="border-dashed py-12 text-center bg-transparent">
            <Receipt className="w-12 h-12 text-muted-foreground opacity-20 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Tidak ada invoice ditemukan.</p>
          </Card>
        ) : (
          invoices.map((invoice) => (
            <Card key={invoice.id} className="hover:shadow-md transition-shadow border-slate-100 group">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">{invoice.invoice_number}</span>
                        {getStatusBadge(invoice.status)}
                      </div>
                      <h4 className="text-sm font-bold truncate">{invoice.players.nama}</h4>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" /> Periode {invoice.periode} • Jatuh Tempo: {new Date(invoice.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:text-right">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Total Tagihan</p>
                      <p className="text-sm font-bold text-primary">Rp {invoice.total_nominal.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-500">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-2 text-[10px] text-muted-foreground font-medium">
        <p>Menampilkan 1-10 dari 124 invoice</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-7 text-[10px]" disabled>Sebelumnya</Button>
          <Button variant="outline" size="sm" className="h-7 text-[10px]">Selanjutnya</Button>
        </div>
      </div>
    </div>
  );
};

export default TreasurerInvoices;
