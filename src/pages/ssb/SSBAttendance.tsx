import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X, Clock, AlertCircle, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface AttendanceRecord {
  player_id: string;
  nama: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpha' | null;
}

const SSBAttendance = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1. Ambil semua pemain
        const { data: playersData, error: playersError } = await supabase
          .from("players")
          .select("id, nama")
          .eq("status", "aktif");

        if (playersError) throw playersError;

        // 2. Ambil data absensi jika sudah ada
        const { data: attendanceData, error: attendanceError } = await supabase
          .from("player_attendances")
          .select("player_id, status")
          .eq("session_id", sessionId);

        if (attendanceError) throw attendanceError;

        // 3. Gabungkan data
        const initialRecords: AttendanceRecord[] = playersData.map(p => {
          const existing = attendanceData?.find(a => a.player_id === p.id);
          return {
            player_id: p.id,
            nama: p.nama,
            status: existing ? (existing.status as any) : null
          };
        });

        setRecords(initialRecords);
      } catch (error: any) {
        console.error("Error fetching attendance:", error);
        toast.error("Gagal memuat data absensi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  const updateStatus = (playerId: string, status: AttendanceRecord['status']) => {
    setRecords(prev => prev.map(r => 
      r.player_id === playerId ? { ...r, status } : r
    ));
  };

  const handleSave = async () => {
    const unselected = records.filter(r => r.status === null);
    if (unselected.length > 0) {
      toast.error(`Masih ada ${unselected.length} pemain yang belum diabsen`);
      return;
    }

    setSaving(true);
    try {
      const upsertData = records.map(r => ({
        player_id: r.player_id,
        session_id: sessionId,
        status: r.status,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from("player_attendances")
        .upsert(upsertData, { onConflict: 'player_id,session_id' });

      if (error) throw error;

      toast.success("Absensi berhasil disimpan");
      navigate("/ssb/training");
    } catch (error: any) {
      console.error("Error saving attendance:", error);
      toast.error("Gagal menyimpan absensi");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Memuat data pemain...</p>
      </div>
    );
  }

  const stats = {
    total: records.length,
    hadir: records.filter(r => r.status === 'hadir').length,
    tidakHadir: records.filter(r => r.status && r.status !== 'hadir').length,
    belumAbsen: records.filter(r => r.status === null).length
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link to="/ssb/training">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Absensi Latihan</h1>
        </div>
        <Button size="sm" onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Simpan
        </Button>
      </div>

      {/* Summary Chips */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        <Badge variant="outline" className="bg-card py-1.5 px-3 whitespace-nowrap">
          Total: {stats.total}
        </Badge>
        <Badge variant="default" className="bg-primary py-1.5 px-3 whitespace-nowrap">
          Hadir: {stats.hadir}
        </Badge>
        <Badge variant="destructive" className="py-1.5 px-3 whitespace-nowrap">
          Absen: {stats.tidakHadir}
        </Badge>
        <Badge variant="secondary" className="py-1.5 px-3 whitespace-nowrap">
          Belum: {stats.belumAbsen}
        </Badge>
      </div>

      <div className="space-y-3">
        {records.map((record) => (
          <Card key={record.player_id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary">
                    {record.nama.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <p className="font-semibold text-sm">{record.nama}</p>
                </div>
                {record.status && (
                  <Badge 
                    variant={record.status === 'hadir' ? 'default' : 'secondary'}
                    className="text-[10px] capitalize"
                  >
                    {record.status}
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                <Button 
                  variant={record.status === 'hadir' ? 'default' : 'outline'}
                  size="sm"
                  className="h-9 text-xs"
                  onClick={() => updateStatus(record.player_id, 'hadir')}
                >
                  Hadir
                </Button>
                <Button 
                  variant={record.status === 'izin' ? 'secondary' : 'outline'}
                  size="sm"
                  className="h-9 text-xs"
                  onClick={() => updateStatus(record.player_id, 'izin')}
                >
                  Izin
                </Button>
                <Button 
                  variant={record.status === 'sakit' ? 'secondary' : 'outline'}
                  size="sm"
                  className="h-9 text-xs"
                  onClick={() => updateStatus(record.player_id, 'sakit')}
                >
                  Sakit
                </Button>
                <Button 
                  variant={record.status === 'alpha' ? 'destructive' : 'outline'}
                  size="sm"
                  className="h-9 text-xs"
                  onClick={() => updateStatus(record.player_id, 'alpha')}
                >
                  Alpha
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SSBAttendance;
