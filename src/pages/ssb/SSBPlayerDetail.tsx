import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Shield, Trophy, Calendar, User, Phone, CheckCircle2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getPlayerHistory } from "@/lib/mock-data";
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

const SSBPlayerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const history = getPlayerHistory(id || "");

  const fetchPlayer = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setPlayer(data);
    } catch (error: any) {
      console.error("Error fetching player:", error);
      toast.error("Gagal mengambil data pemain");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlayer();
  }, [fetchPlayer]);

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Memuat data pemain...</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 text-center">
        <p className="text-muted-foreground">Pemain tidak ditemukan</p>
        <Link to="/ssb/players" className="text-primary text-sm mt-4 inline-block">Kembali ke daftar pemain</Link>
      </div>
    );
  }

  // Aggregate stats
  const totalMatches = history.reduce((s, h) => s + h.matchesPlayed, 0);
  const totalGoals = history.reduce((s, h) => s + h.goals, 0);
  const totalAssists = history.reduce((s, h) => s + h.assists, 0);
  const totalYellow = history.reduce((s, h) => s + h.yellowCards, 0);

  const age = Math.floor((Date.now() - new Date(player.tanggal_lahir).getTime()) / (365.25 * 24 * 60 * 60 * 1000));

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <Link to="/ssb/players" className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
          <span className="text-primary font-bold text-xl">
            {player.nama.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-foreground">{player.nama}</h1>
            {player.verified && (
              <Badge variant="default" className="text-[9px] gap-0.5 px-1.5 py-0">
                <CheckCircle2 className="w-2.5 h-2.5" /> Global ID
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">{player.posisi} · {age} tahun</p>
          <p className="text-muted-foreground text-xs">Aktif di SSB</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { label: "Match", value: totalMatches },
          { label: "Gol", value: totalGoals },
          { label: "Assist", value: totalAssists },
          { label: "Kartu", value: totalYellow },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-3 text-center">
              <p className="text-lg font-bold text-primary">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="w-full">
          <TabsTrigger value="profile" className="flex-1 text-xs">Profil</TabsTrigger>
          <TabsTrigger value="history" className="flex-1 text-xs">Riwayat Kompetisi</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Nama Lengkap</p>
                  <p className="text-sm text-foreground">{player.nama}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Tanggal Lahir</p>
                  <p className="text-sm text-foreground">
                    {new Date(player.tanggal_lahir).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })} ({age} tahun)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Player ID</p>
                  <p className="text-sm text-foreground font-mono">{player.id.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Posisi</p>
                  <p className="text-sm text-foreground">{player.posisi}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-[10px] text-muted-foreground">Status</p>
                  <p className="text-sm text-foreground">{player.status === 'active' ? 'Aktif' : 'Nonaktif'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          {history.length === 0 ? (
            <Card className="bg-secondary/50 border-0">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground text-sm">Belum ada riwayat kompetisi</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Kompetisi</TableHead>
                      <TableHead className="text-xs text-center">M</TableHead>
                      <TableHead className="text-xs text-center">G</TableHead>
                      <TableHead className="text-xs text-center">A</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((h) => (
                      <TableRow key={h.competitionId}>
                        <TableCell>
                          <p className="text-xs font-medium text-foreground">{h.competitionName}</p>
                          <p className="text-[10px] text-muted-foreground">{h.teamName} · {h.season}</p>
                        </TableCell>
                        <TableCell className="text-center text-sm">{h.matchesPlayed}</TableCell>
                        <TableCell className="text-center text-sm font-medium text-primary">{h.goals}</TableCell>
                        <TableCell className="text-center text-sm">{h.assists}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SSBPlayerDetail;
