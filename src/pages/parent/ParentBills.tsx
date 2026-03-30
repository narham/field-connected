import { useEffect, useState } from "react";
import { 
  Receipt, 
  CreditCard, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Loader2,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
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
import { sendNotification } from "@/services/notificationService";

interface Bill {
  id: string;
  player_id: string;
  players: { nama: string };
  periode: string;
  nominal: number;
  status: 'unpaid' | 'paid' | 'overdue';
  due_date: string;
  virtual_account: string;
}

/**
 * ParentBills Component
 * 
 * Halaman manajemen tagihan dan pembayaran untuk orang tua.
 * Fitur:
 * 1. Daftar tagihan (Aktif & Riwayat).
 * 2. Pilih metode pembayaran (Transfer, QRIS).
 * 3. Unggah bukti pembayaran.
 * 4. Status verifikasi real-time.
 */
const ParentBills = () => {
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [method, setMethod] = useState("transfer");

  const fetchBills = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: parent } = await supabase
        .from("parents")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!parent) return;

      const { data: relations } = await supabase
        .from("parent_players")
        .select("player_id")
        .eq("parent_id", parent.id);

      if (!relations) return;

      const childIds = relations.map(r => r.player_id);

      const { data, error } = await supabase
        .from("player_bills")
        .select("*, players(nama)")
        .in("player_id", childIds)
        .order("due_date", { ascending: false });

      if (error) throw error;
      setBills(data || []);
    } catch (error) {
      console.error("Fetch Bills Error:", error);
      toast.error("Gagal memuat data tagihan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleUploadProof = async () => {
    if (!selectedBill || !file) {
      toast.error("Silakan pilih file bukti bayar.");
      return;
    }

    setUploading(true);
    try {
      // 1. Upload to Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedBill.id}-${Math.random()}.${fileExt}`;
      const filePath = `proofs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('player-payments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Create Payment Record
      const { error: paymentError } = await supabase
        .from("player_payments")
        .insert({
          player_id: selectedBill.player_id,
          bill_id: selectedBill.id,
          amount: selectedBill.nominal,
          payment_date: new Date().toISOString(),
          payment_method: method,
          proof_url: filePath,
          status: 'belum_bayar', // Status pembayaran, bukan tagihan
          verified: false
        });

      if (paymentError) throw paymentError;

      // 3. Simulate Notification to Parent
      await sendNotification('new_bill', {
        nama_anak: selectedBill.players.nama,
        jumlah: `Rp ${Number(selectedBill.nominal).toLocaleString("id-ID")}`,
        tanggal: selectedBill.due_date
      });

      toast.success("Bukti bayar berhasil diunggah. Menunggu verifikasi admin.");
      setSelectedBill(null);
      setFile(null);
      fetchBills();
    } catch (error: any) {
      console.error("Upload Error:", error);
      toast.error(error.message || "Gagal mengunggah bukti bayar.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="px-4 py-6 space-y-6">
      <header>
        <h2 className="text-xl font-bold">Tagihan & Pembayaran</h2>
        <p className="text-xs text-muted-foreground">Selesaikan iuran bulanan tepat waktu.</p>
      </header>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : bills.length === 0 ? (
          <Card className="border-dashed py-12 text-center">
            <Receipt className="w-12 h-12 text-muted-foreground opacity-20 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Tidak ada tagihan ditemukan.</p>
          </Card>
        ) : (
          bills.map((bill) => (
            <Card key={bill.id} className="shadow-sm border-slate-100">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Periode {bill.periode}</p>
                    <h4 className="text-sm font-bold">{bill.players.nama}</h4>
                  </div>
                  <Badge 
                    variant={bill.status === 'paid' ? 'default' : bill.status === 'overdue' ? 'destructive' : 'secondary'}
                    className="text-[9px] h-5"
                  >
                    {bill.status === 'paid' ? 'Lunas' : bill.status === 'overdue' ? 'Terlambat' : 'Belum Bayar'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between border-t pt-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground">Total Tagihan</p>
                    <p className="text-sm font-bold text-primary">Rp {Number(bill.nominal).toLocaleString("id-ID")}</p>
                  </div>
                  
                  {bill.status !== 'paid' && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" onClick={() => setSelectedBill(bill)}>
                          Bayar Sekarang
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-xs sm:max-w-md rounded-2xl">
                        <DialogHeader>
                          <DialogTitle>Detail Pembayaran</DialogTitle>
                          <DialogDescription>
                            Gunakan kode Virtual Account berikut untuk melakukan transfer.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4 py-4">
                          <div className="bg-slate-50 p-4 rounded-xl text-center">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Mandiri Virtual Account</p>
                            <p className="text-xl font-mono font-bold tracking-wider text-primary">
                              {bill.virtual_account || "8801234567890"}
                            </p>
                            <Button variant="ghost" size="sm" className="text-[10px] h-6 mt-2 text-primary">Salin Kode</Button>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs">Metode Pembayaran</Label>
                            <Select value={method} onValueChange={setMethod}>
                              <SelectTrigger className="h-9 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="transfer">Transfer Bank</SelectItem>
                                <SelectItem value="qris">QRIS (Otomatis)</SelectItem>
                                <SelectItem value="e-wallet">E-Wallet (OVO/Dana)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs">Unggah Bukti Bayar</Label>
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center">
                              {file ? (
                                <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
                                  <span className="text-[10px] truncate max-w-[150px]">{file.name}</span>
                                  <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="h-6 w-6 p-0 text-destructive">×</Button>
                                </div>
                              ) : (
                                <label className="cursor-pointer">
                                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
                                  <p className="text-[10px] text-muted-foreground">Pilih file (Maks 2MB)</p>
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*,application/pdf"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        </div>

                        <DialogFooter>
                          <Button 
                            className="w-full" 
                            disabled={!file || uploading} 
                            onClick={handleUploadProof}
                          >
                            {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                            Konfirmasi Pembayaran
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
                
                {bill.status === 'unpaid' && (
                  <div className="mt-3 flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 p-2 rounded-lg">
                    <Clock className="w-3 h-3" />
                    <span>Batas waktu bayar: {new Date(bill.due_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ParentBills;
