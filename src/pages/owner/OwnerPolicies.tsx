import { useEffect, useState } from "react";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight,
  BookOpen,
  Loader2,
  Lock,
  Eye,
  AlertCircle
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Policy {
  id: string;
  title: string;
  category: 'SOP' | 'FINANCIAL' | 'DISCIPLINE';
  content: string;
  is_active: boolean;
  created_at: string;
}

const OwnerPolicies = () => {
  const [loading, setLoading] = useState(true);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [search, setSearch] = useState("");

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      // Mock data for policies
      const mockPolicies: Policy[] = [
        { 
          id: '1', 
          title: 'SOP Pendaftaran Siswa Baru', 
          category: 'SOP', 
          content: 'Seluruh siswa baru wajib melampirkan akta kelahiran dan kartu keluarga...', 
          is_active: true, 
          created_at: '2026-01-01' 
        },
        { 
          id: '2', 
          title: 'Kebijakan Pengembalian Dana (Refund)', 
          category: 'FINANCIAL', 
          content: 'Refund hanya diperbolehkan jika siswa mengundurkan diri sebelum periode latihan dimulai...', 
          is_active: true, 
          created_at: '2026-02-15' 
        },
        { 
          id: '3', 
          title: 'Kode Etik Pelatih & Staf', 
          category: 'DISCIPLINE', 
          content: 'Pelatih dilarang keras melakukan tindakan kekerasan verbal maupun fisik...', 
          is_active: true, 
          created_at: '2026-03-10' 
        },
      ];
      setPolicies(mockPolicies);
    } catch (error) {
      console.error("Fetch Policies Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'FINANCIAL': return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none text-[8px]">Keuangan</Badge>;
      case 'DISCIPLINE': return <Badge variant="secondary" className="bg-rose-100 text-rose-700 border-none text-[8px]">Disiplin</Badge>;
      default: return <Badge variant="secondary" className="bg-slate-100 text-slate-700 border-none text-[8px]">SOP Umum</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Regulasi & SOP Klub</h1>
          <p className="text-xs text-muted-foreground">Pusat dokumentasi kebijakan internal dan standar operasional.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" /> Buat Kebijakan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Tambah Kebijakan Baru</DialogTitle>
              <DialogDescription>Kebijakan ini akan menjadi acuan bagi seluruh admin dan staf.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label className="text-xs">Judul Kebijakan</Label>
                <Input placeholder="Contoh: SOP Keamanan Fasilitas" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Kategori</Label>
                <Select defaultValue="SOP">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOP">SOP Operasional</SelectItem>
                    <SelectItem value="FINANCIAL">Kebijakan Keuangan</SelectItem>
                    <SelectItem value="DISCIPLINE">Peraturan Disiplin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Isi Kebijakan</Label>
                <Textarea placeholder="Tuliskan detail kebijakan di sini..." className="min-h-[150px]" />
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full">Simpan & Publikasikan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      {/* Filters */}
      <Card className="shadow-none border-slate-100 bg-white">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari kebijakan..." 
              className="pl-10 h-10 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10">
            <Filter className="w-4 h-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Policy List */}
      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Memuat dokumen kebijakan...</p>
          </div>
        ) : (
          policies.map((policy) => (
            <Card key={policy.id} className="shadow-sm border-slate-100 hover:border-primary/20 transition-all group relative overflow-hidden">
              <CardHeader className="p-5 pb-3">
                <div className="flex justify-between items-start mb-2">
                  {getCategoryBadge(policy.category)}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-500"><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </div>
                <CardTitle className="text-sm font-bold leading-tight group-hover:text-primary transition-colors">{policy.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <p className="text-[10px] text-muted-foreground line-clamp-2 mb-4 leading-relaxed italic">
                  {policy.content}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <span className="text-[9px] text-slate-400 font-medium flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Diperbarui {new Date(policy.created_at).toLocaleDateString('id-ID')}
                  </span>
                  <Button variant="ghost" size="sm" className="h-6 text-[9px] gap-1 hover:bg-primary/5 hover:text-primary p-0 px-2">
                    Baca Selengkapnya <ChevronRight className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Audit Alert */}
      <div className="bg-slate-900 text-slate-400 p-4 rounded-2xl flex items-start gap-3 border border-slate-800">
        <ShieldAlert className="w-5 h-5 text-primary shrink-0" />
        <div>
          <p className="text-xs font-bold text-white">Catatan Transparansi</p>
          <p className="text-[10px] leading-relaxed mt-1">
            Setiap perubahan kebijakan akan dicatat secara permanen dalam sistem audit untuk menjamin transparansi operasional klub.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OwnerPolicies;
