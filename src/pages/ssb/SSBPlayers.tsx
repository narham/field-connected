import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Plus, Filter, ChevronRight, CheckCircle2, Loader2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

interface Player {
  id: string;
  nama: string;
  posisi: string;
  status: string;
  verified: boolean;
  tanggal_lahir: string;
  created_at: string;
}

/**
 * SSBPlayers Component
 * 
 * Modul Manajemen Pemain untuk Sekolah Sepak Bola (SSB).
 * Memungkinkan pengelola SSB untuk:
 * 1. Melihat daftar pemain yang terdaftar.
 * 2. Mencari pemain berdasarkan nama.
 * 3. Mendaftarkan pemain baru (dengan validasi NIK & Nama Ibu).
 * 
 * Logika Bisnis:
 * - Data pemain disimpan di tabel 'players'.
 * - NIK pemain bersifat unik untuk mencegah duplikasi global.
 * - Pemain baru harus diverifikasi oleh EO sebelum berpartisipasi dalam kompetisi.
 */
const SSBPlayers = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  
  // Form states
  const [formData, setFormData] = useState({
    nama: "",
    tanggal_lahir: "",
    posisi: "",
    nik: "",
    nama_ibu_kandung: "",
  });

  const fetchPlayers = useCallback(async () => {
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPlayers(data || []);
    } catch (error: any) {
      console.error("Error fetching players:", error);
      toast.error("Gagal mengambil data pemain");
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const filtered = players.filter((p) =>
    p.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, posisi: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Sesi berakhir, silakan login kembali.");
        navigate("/login");
        return;
      }

      console.log("Invoking 'create-player' with current session...");

      const { data, error } = await supabase.functions.invoke("create-player", {
        body: formData,
      });

      if (error) {
        console.error("Functions error object:", error);
        
        // Handle 401 Unauthorized (Invalid JWT)
        if (error.status === 401) {
          const errorBody = await error.context.json();
          toast.error(`Sesi tidak valid: ${errorBody.message || "Invalid JWT"}. Silakan login kembali.`);
          await supabase.auth.signOut();
          navigate("/login");
          return;
        }

        // Coba ambil pesan error dari response body jika ada
        let errorMessage = "Gagal memproses data";
        if (error.context) {
          try {
            const body = await error.context.json();
            errorMessage = body.error || body.message || body.details || errorMessage;
          } catch (e) {
            console.error("Failed to parse error body", e);
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        throw new Error(errorMessage);
      }

      toast.success("Pemain berhasil ditambahkan!");
      setIsDialogOpen(false);
      setFormData({
        nama: "",
        tanggal_lahir: "",
        posisi: "",
        nik: "",
        nama_ibu_kandung: "",
      });
      fetchPlayers(); // Refresh the list
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(error.message || "Gagal menambahkan pemain");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-foreground">Pemain</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1">
              <Plus className="w-4 h-4" /> Tambah
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Tambah Pemain Baru</DialogTitle>
                <DialogDescription>
                  Lengkapi data pemain di bawah ini. Data NIK dan Nama Ibu Kandung akan dienkripsi secara aman.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input
                    id="nama"
                    placeholder="Nama sesuai akta lahir"
                    value={formData.nama}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                  <Input
                    id="tanggal_lahir"
                    type="date"
                    value={formData.tanggal_lahir}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="posisi">Posisi</Label>
                  <Select onValueChange={handleSelectChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih posisi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GK">GK (Kiper)</SelectItem>
                      <SelectItem value="CB">CB (Bek Tengah)</SelectItem>
                      <SelectItem value="LB">LB (Bek Kiri)</SelectItem>
                      <SelectItem value="RB">RB (Bek Kanan)</SelectItem>
                      <SelectItem value="DM">DM (Gelandang Bertahan)</SelectItem>
                      <SelectItem value="CM">CM (Gelandang Tengah)</SelectItem>
                      <SelectItem value="AM">AM (Gelandang Serang)</SelectItem>
                      <SelectItem value="LW">LW (Penyerang Sayap Kiri)</SelectItem>
                      <SelectItem value="RW">RW (Penyerang Sayap Kanan)</SelectItem>
                      <SelectItem value="ST">ST (Striker)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nik">NIK (16 Digit)</Label>
                  <Input
                    id="nik"
                    placeholder="Contoh: 327501..."
                    maxLength={16}
                    value={formData.nik}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nama_ibu_kandung">Nama Ibu Kandung</Label>
                  <Input
                    id="nama_ibu_kandung"
                    placeholder="Untuk verifikasi data"
                    value={formData.nama_ibu_kandung}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Pemain"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari pemain..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>Memuat data pemain...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            {search ? "Pemain tidak ditemukan" : "Belum ada pemain. Tambahkan pemain pertama Anda!"}
          </div>
        ) : (
          filtered.map((player) => (
            <Link key={player.id} to={`/ssb/players/${player.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer mb-2">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">
                      {player.nama.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-medium text-foreground text-sm truncate">{player.nama}</p>
                      {player.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {player.posisi} · {new Date().getFullYear() - new Date(player.tanggal_lahir).getFullYear()} Tahun
                    </p>
                  </div>
                  <Badge variant={player.status === "active" ? "default" : "secondary"} className="text-[10px]">
                    {player.status === "active" ? "Aktif" : "Nonaktif"}
                  </Badge>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default SSBPlayers;
