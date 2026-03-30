import { useEffect, useState } from "react";
import { 
  UserPlus, 
  Search, 
  Filter, 
  ShieldCheck, 
  ShieldAlert, 
  MoreVertical, 
  Mail, 
  Phone, 
  Loader2,
  Trash2,
  Lock,
  UserCog,
  CheckCircle2,
  XCircle,
  Clock
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

interface Admin {
  id: string;
  user_id: string;
  nama: string;
  email: string;
  role: 'SSB_ADMIN' | 'TREASURER' | 'STAFF' | 'OWNER';
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
}

const OwnerAdminManagement = () => {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [search, setSearch] = useState("");
  const [isInviteLoading, setIsInviteLoading] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      // In real implementation, fetch from 'club_admins' table with joins
      const mockAdmins: Admin[] = [
        { id: '1', user_id: 'u1', nama: 'Andi Bendahara', email: 'andi@ssb.com', role: 'TREASURER', status: 'active', created_at: '2026-01-10' },
        { id: '2', user_id: 'u2', nama: 'Budi Ops', email: 'budi@ssb.com', role: 'SSB_ADMIN', status: 'active', created_at: '2026-01-15' },
        { id: '3', user_id: 'u3', nama: 'Siti Admin', email: 'siti@ssb.com', role: 'STAFF', status: 'pending', created_at: '2026-03-28' },
      ];
      setAdmins(mockAdmins);
    } catch (error) {
      console.error("Fetch Admins Error:", error);
      toast.error("Gagal memuat data admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleInvite = async () => {
    setIsInviteLoading(true);
    try {
      // Simulate invitation
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Undangan admin berhasil dikirim ke email.");
      fetchAdmins();
    } catch (error) {
      toast.error("Gagal mengirim undangan.");
    } finally {
      setIsInviteLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'OWNER': return <Badge className="bg-slate-900 text-white border-none text-[10px]">Owner</Badge>;
      case 'SSB_ADMIN': return <Badge variant="default" className="text-[10px]">SSB Admin</Badge>;
      case 'TREASURER': return <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none text-[10px]">Treasurer</Badge>;
      default: return <Badge variant="outline" className="text-[10px]">Staff</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-emerald-100 text-emerald-700 border-none text-[10px]"><CheckCircle2 className="w-3 h-3 mr-1" /> Aktif</Badge>;
      case 'pending': return <Badge className="bg-amber-100 text-amber-700 border-none text-[10px]"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      default: return <Badge variant="destructive" className="text-[10px]"><XCircle className="w-3 h-3 mr-1" /> Inaktif</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold">Manajemen Admin & Staf</h1>
          <p className="text-xs text-muted-foreground">Kelola hak akses dan onboarding tim manajemen klub.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <UserPlus className="w-4 h-4" /> Undang Admin Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Undang Tim Manajemen</DialogTitle>
              <DialogDescription>
                Masukkan email calon admin. Mereka akan menerima tautan pendaftaran.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label className="text-xs">Email Calon Admin</Label>
                <Input placeholder="name@ssb.com" type="email" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Role / Jabatan</Label>
                <Select defaultValue="STAFF">
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SSB_ADMIN">SSB Admin (Operasional)</SelectItem>
                    <SelectItem value="TREASURER">Bendahara (Keuangan)</SelectItem>
                    <SelectItem value="STAFF">Staff Umum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button className="w-full" onClick={handleInvite} disabled={isInviteLoading}>
                {isInviteLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Mail className="w-4 h-4 mr-2" />}
                Kirim Undangan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-none border-slate-100">
          <CardContent className="p-4">
            <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">Total Admin</p>
            <p className="text-xl font-bold">12</p>
          </CardContent>
        </Card>
        <Card className="shadow-none border-slate-100">
          <CardContent className="p-4">
            <p className="text-[10px] text-emerald-600 uppercase font-bold mb-1">Aktif</p>
            <p className="text-xl font-bold text-emerald-700">10</p>
          </CardContent>
        </Card>
        <Card className="shadow-none border-slate-100">
          <CardContent className="p-4">
            <p className="text-[10px] text-amber-600 uppercase font-bold mb-1">Pending</p>
            <p className="text-xl font-bold text-amber-700">2</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-none border-slate-100 bg-white">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari admin berdasarkan nama atau email..." 
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

      {/* Admin List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Memuat daftar admin...</p>
          </div>
        ) : (
          admins.map((admin) => (
            <Card key={admin.id} className="shadow-sm border-slate-100 hover:border-primary/20 transition-all group overflow-hidden">
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                {getRoleBadge(admin.role)}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground"><UserCog className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-rose-500"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border">
                    <ShieldCheck className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold truncate">{admin.nama}</h4>
                    <p className="text-[10px] text-muted-foreground truncate">{admin.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                    <Clock className="w-3 h-3" /> Bergabung {new Date(admin.created_at).toLocaleDateString('id-ID')}
                  </div>
                  {getStatusBadge(admin.status)}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default OwnerAdminManagement;
