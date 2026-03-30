import { useState, useEffect } from "react";
import { Search, Filter, Phone, MessageSquare, Shield, User, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Player {
  id: string;
  nama: string;
  posisi: string;
  status: string;
  verified: boolean;
  tanggal_lahir: string;
  parent_phone?: string; 
  attendance_rate?: number; // New field
}

/**
 * CoachRoster Component
 * 
 * Modul Manajemen Roster Pemain untuk Pelatih.
 * Fitur:
 * 1. Menampilkan daftar pemain aktif dalam tim yang diampu.
 * 2. Filter pencarian berdasarkan nama atau posisi.
 * 3. Aksi Cepat: Tombol Telepon & WhatsApp langsung ke wali/orang tua pemain.
 * 
 * Keamanan:
 * - Data dibatasi oleh RLS (hanya menampilkan pemain dari tim pelatih).
 * - Nomor telepon orang tua diambil dari data wali pemain (relasi).
 */
const CoachRoster = () => {
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoster = async () => {
      setLoading(true);
      try {
        // Ambil data pemain yang diizinkan oleh RLS (tim yang diampu pelatih)
        const { data: playerData, error } = await supabase
          .from("players")
          .select("*")
          .order("nama", { ascending: true });

        if (error) throw error;

        // Fetch attendance stats for these players
        const playerIds = playerData.map(p => p.id);
        const { data: attendanceData } = await supabase
          .from("player_attendances")
          .select("player_id, status")
          .in("player_id", playerIds);

        const playersWithStats = playerData.map(p => {
          const pAttendance = attendanceData?.filter(a => a.player_id === p.id) || [];
          const total = pAttendance.length;
          const present = pAttendance.filter(a => a.status === 'hadir').length;
          const rate = total > 0 ? Math.round((present / total) * 100) : 0;
          
          return {
            ...p,
            attendance_rate: rate
          };
        });

        setPlayers(playersWithStats);
      } catch (error: any) {
        console.error("Error fetching roster:", error);
        toast.error("Gagal mengambil data tim");
      } finally {
        setLoading(false);
      }
    };

    fetchRoster();
  }, []);

  const filtered = players.filter((p) =>
    p.nama.toLowerCase().includes(search.toLowerCase()) ||
    p.posisi.toLowerCase().includes(search.toLowerCase())
  );

  const handleCall = (phone?: string) => {
    if (!phone) {
      toast.error("Nomor telepon tidak tersedia");
      return;
    }
    window.location.href = `tel:${phone}`;
  };

  const handleWA = (phone?: string, name?: string) => {
    if (!phone) {
      toast.error("Nomor telepon tidak tersedia");
      return;
    }
    const msg = encodeURIComponent(`Halo, saya Coach dari tim GrassRoots. Ingin menginfokan terkait pemain ${name}.`);
    window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Roster Tim</h1>
          <p className="text-xs text-muted-foreground">Kelola pemain aktif Anda</p>
        </div>
        <Badge variant="outline" className="h-6">
          {players.length} Pemain
        </Badge>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau posisi..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-sm">Memuat roster tim...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
            {search ? "Pemain tidak ditemukan" : "Roster tim masih kosong"}
          </div>
        ) : (
          filtered.map((player) => (
            <Card key={player.id} className="overflow-hidden border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold text-primary text-lg">
                    {player.nama.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-foreground truncate">{player.nama}</p>
                      {player.verified && (
                        <Shield className="w-3.5 h-3.5 text-primary fill-primary/10" />
                      )}
                      {player.attendance_rate !== undefined && (
                        <Badge variant="secondary" className="text-[9px] h-4 px-1">
                          {player.attendance_rate}% Hadir
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-[9px] py-0 px-1.5 h-4">
                        {player.posisi}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date().getFullYear() - new Date(player.tanggal_lahir).getFullYear()} Thn
                      </span>
                    </div>
                  </div>
                  <Badge variant={player.status === 'aktif' ? 'default' : 'secondary'} className="text-[10px]">
                    {player.status === 'aktif' ? 'Aktif' : 'Izin'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 h-9 text-xs"
                    onClick={() => handleCall(player.parent_phone)}
                  >
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    Telepon
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 h-9 text-xs"
                    onClick={() => handleWA(player.parent_phone, player.nama)}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-green-600" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CoachRoster;
