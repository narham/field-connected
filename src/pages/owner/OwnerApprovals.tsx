import { useEffect, useState } from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRightLeft, 
  FileText, 
  BadgeDollarSign, 
  Trophy,
  Loader2,
  ChevronRight,
  User,
  AlertCircle,
  Eye,
  MessageSquare
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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Approval {
  id: string;
  type: 'PLAYER_TRANSFER' | 'CONTRACT' | 'BUDGET' | 'TOURNAMENT';
  title: string;
  requester: string;
  amount?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  description: string;
}

const OwnerApprovals = () => {
  const [loading, setLoading] = useState(true);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchApprovals = async () => {
    setLoading(true);
    try {
      // Mock data for approvals
      const mockApprovals: Approval[] = [
        { 
          id: '1', 
          type: 'BUDGET', 
          title: 'Renovasi Lapangan Utama', 
          requester: 'Andi (Treasurer)', 
          amount: 45000000, 
          status: 'PENDING', 
          created_at: '2026-03-29T10:00:00Z',
          description: 'Penggantian rumput sintetis di area kotak penalti yang sudah aus.'
        },
        { 
          id: '2', 
          type: 'PLAYER_TRANSFER', 
          title: 'Transfer Keluar: Budi Santoso', 
          requester: 'Coach Bambang', 
          status: 'PENDING', 
          created_at: '2026-03-30T08:30:00Z',
          description: 'Pemain mendapatkan beasiswa di Akademi Luar Negeri.'
        },
        { 
          id: '3', 
          type: 'TOURNAMENT', 
          title: 'Keikutsertaan Piala Menpora U13', 
          requester: 'Coach Bambang', 
          amount: 5000000, 
          status: 'PENDING', 
          created_at: '2026-03-30T14:20:00Z',
          description: 'Pendaftaran tim U13 untuk kompetisi tingkat nasional.'
        }
      ];
      setApprovals(mockApprovals);
    } catch (error) {
      console.error("Fetch Approvals Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleAction = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    setProcessingId(id);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Keputusan berhasil ${action === 'APPROVED' ? 'disetujui' : 'ditolak'}.`);
      setApprovals(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      toast.error("Gagal memproses keputusan.");
    } finally {
      setProcessingId(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'BUDGET': return <BadgeDollarSign className="w-5 h-5 text-emerald-500" />;
      case 'PLAYER_TRANSFER': return <ArrowRightLeft className="w-5 h-5 text-blue-500" />;
      case 'TOURNAMENT': return <Trophy className="w-5 h-5 text-amber-500" />;
      default: return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-bold">Approval Keputusan Strategis</h1>
        <p className="text-xs text-muted-foreground">Otorisasi anggaran, transfer, dan kebijakan operasional klub.</p>
      </header>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-sm">Memeriksa antrean approval...</p>
          </div>
        ) : approvals.length === 0 ? (
          <Card className="border-dashed py-16 text-center bg-transparent">
            <CheckCircle2 className="w-12 h-12 text-emerald-500/20 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Semua keputusan telah diproses.</p>
          </Card>
        ) : (
          approvals.map((approval) => (
            <Card key={approval.id} className="shadow-sm border-slate-100 overflow-hidden group">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Left: Info */}
                  <div className="flex-1 p-5 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center border group-hover:border-primary/20 transition-colors">
                      {getTypeIcon(approval.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-[8px] h-4 uppercase tracking-tighter">{approval.type.replace('_', ' ')}</Badge>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {new Date(approval.created_at).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">{approval.title}</h4>
                      <p className="text-[10px] text-muted-foreground mt-1">Diajukan oleh: <span className="font-bold text-slate-600">{approval.requester}</span></p>
                    </div>
                  </div>

                  {/* Middle: Details */}
                  <div className="px-5 py-4 md:py-0 md:px-8 flex flex-col justify-center bg-slate-50/50 md:bg-transparent border-y md:border-y-0 md:border-x border-slate-100">
                    {approval.amount && (
                      <div className="mb-2 md:mb-0">
                        <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">Estimasi Biaya</p>
                        <p className="text-lg font-black text-primary">Rp {approval.amount.toLocaleString('id-ID')}</p>
                      </div>
                    )}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" size="sm" className="h-auto p-0 text-[10px] justify-start gap-1">
                          <Eye className="w-3 h-3" /> Lihat Detail Justifikasi
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>{approval.title}</DialogTitle>
                          <DialogDescription>Justifikasi dan detail pengajuan.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-xs text-slate-600 leading-relaxed italic">"{approval.description}"</p>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <AlertCircle className="w-3 h-3" />
                            Keputusan ini akan dicatat dalam audit trail sistem.
                          </div>
                        </div>
                        <DialogFooter className="flex flex-row gap-2">
                          <Button variant="outline" className="flex-1 text-xs gap-2" onClick={() => handleAction(approval.id, 'REJECTED')}>
                            <XCircle className="w-3 h-3" /> Tolak
                          </Button>
                          <Button className="flex-1 text-xs gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => handleAction(approval.id, 'APPROVED')}>
                            <CheckCircle2 className="w-3 h-3" /> Setujui
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Right: Quick Actions */}
                  <div className="p-5 flex items-center justify-center gap-2 bg-slate-50 md:bg-white">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9 w-9 p-0 text-rose-500 border-rose-100 hover:bg-rose-50 hover:text-rose-600"
                      disabled={!!processingId}
                      onClick={() => handleAction(approval.id, 'REJECTED')}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      className="h-9 gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                      disabled={!!processingId}
                      onClick={() => handleAction(approval.id, 'APPROVED')}
                    >
                      {processingId === approval.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default OwnerApprovals;
