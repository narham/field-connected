import { useEffect, useState } from "react";
import { 
  CreditCard, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Loader2,
  Calendar,
  Image as ImageIcon,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Eye,
  Check
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

interface Payment {
  id: string;
  bill_id: string;
  player_id: string;
  players: { nama: string };
  amount: number;
  payment_method: string;
  proof_url: string;
  verified: boolean;
  payment_date: string;
  notes?: string;
}

const TreasurerPayments = () => {
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");

  const fetchPayments = async () => {
    setLoading(true);
    try {
      // In real implementation, fetch from 'player_payments' table
      const mockPayments: Payment[] = [
        {
          id: 'pay-001',
          bill_id: 'inv-001',
          player_id: 'p1',
          players: { nama: 'Budi Santoso' },
          amount: 450000,
          payment_method: 'transfer',
          proof_url: 'proofs/p1_juni.jpg',
          verified: false,
          payment_date: '2026-06-02T10:30:00Z',
          notes: 'Sudah ditransfer via Mandiri'
        },
        {
          id: 'pay-002',
          bill_id: 'inv-002',
          player_id: 'p2',
          players: { nama: 'Andi Wijaya' },
          amount: 350000,
          payment_method: 'qris',
          proof_url: 'proofs/p2_juni.png',
          verified: true,
          payment_date: '2026-06-01T15:20:00Z'
        }
      ];
      setPayments(mockPayments);
    } catch (error) {
      console.error("Fetch Payments Error:", error);
      toast.error("Gagal memuat data pembayaran.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleVerify = async (paymentId: string) => {
    setVerifying(paymentId);
    try {
      // Simulate verification process
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Pembayaran berhasil diverifikasi. Status invoice diperbarui.");
      fetchPayments();
    } catch (error) {
      toast.error("Gagal melakukan verifikasi.");
    } finally {
      setVerifying(null);
    }
  };

  const getStatusBadge = (verified: boolean) => {
    return verified 
      ? <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-[10px]"><ShieldCheck className="w-3 h-3 mr-1" /> Terverifikasi</Badge>
      : <Badge variant="secondary" className="text-[10px] text-amber-600 bg-amber-50 border-amber-200"><Clock className="w-3 h-3 mr-1" /> Menunggu</Badge>;
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-bold">Verifikasi Pembayaran</h1>
        <p className="text-xs text-muted-foreground">Konfirmasi bukti transfer dan update status tagihan.</p>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-none border-slate-100 bg-blue-50/30">
          <CardContent className="p-4">
            <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">Total Pending</p>
            <p className="text-xl font-bold text-blue-700">12</p>
            <p className="text-[9px] text-blue-600/70">Pembayaran</p>
          </CardContent>
        </Card>
        <Card className="shadow-none border-slate-100 bg-emerald-50/30">
          <CardContent className="p-4">
            <p className="text-[10px] text-emerald-600 font-bold uppercase mb-1">Total Terverifikasi</p>
            <p className="text-xl font-bold text-emerald-700">192</p>
            <p className="text-[9px] text-emerald-600/70">Pembayaran (Bulan ini)</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-none border-slate-100">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari nama pemain..." 
              className="pl-10 h-10 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px] h-10 text-sm">
              <SelectValue placeholder="Status Verifikasi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Menunggu Verifikasi</SelectItem>
              <SelectItem value="verified">Terverifikasi</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Payment List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-sm">Memuat daftar pembayaran...</p>
          </div>
        ) : (
          payments.map((payment) => (
            <Card key={payment.id} className="shadow-sm border-slate-100 hover:border-slate-200 transition-all overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Left: Info Section */}
                  <div className="flex-1 p-4 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{payment.payment_method}</span>
                        {getStatusBadge(payment.verified)}
                      </div>
                      <h4 className="text-sm font-bold truncate">{payment.players.nama}</h4>
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(payment.payment_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Middle: Amount & Proof Link */}
                  <div className="px-4 md:px-6 py-4 md:py-6 flex flex-col sm:flex-row items-center gap-6 bg-slate-50/50 md:bg-transparent border-t md:border-t-0 md:border-x">
                    <div className="sm:text-right">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter mb-1">Nominal Transfer</p>
                      <p className="text-lg font-bold text-primary">Rp {payment.amount.toLocaleString('id-ID')}</p>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2 text-xs border-slate-200">
                          <Eye className="w-4 h-4" /> Bukti Bayar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Bukti Pembayaran</DialogTitle>
                          <DialogDescription>
                            Siswa: {payment.players.nama} • {payment.payment_method.toUpperCase()}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-center min-h-[300px]">
                          <ImageIcon className="w-12 h-12 text-slate-300 opacity-20" />
                          <p className="absolute text-xs text-muted-foreground italic">Pratinjau Bukti Bayar (OCR Simulation Active)</p>
                        </div>
                        <DialogFooter className="flex flex-row gap-2">
                          <Button variant="outline" className="flex-1 text-xs gap-2" asChild>
                            <a href="#" target="_blank"><ExternalLink className="w-3 h-3" /> Buka Full</a>
                          </Button>
                          <Button variant="destructive" className="flex-1 text-xs gap-2">
                            <XCircle className="w-3 h-3" /> Tolak Bukti
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Right: Actions */}
                  {!payment.verified && (
                    <div className="p-4 md:p-6 flex items-center justify-center gap-2 bg-slate-50 md:bg-white border-t md:border-t-0">
                      <Button 
                        size="sm" 
                        className="w-full md:w-auto gap-2 bg-emerald-600 hover:bg-emerald-700"
                        disabled={!!verifying}
                        onClick={() => handleVerify(payment.id)}
                      >
                        {verifying === payment.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Verifikasi
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TreasurerPayments;
