import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, Clock, MapPin, Users, Plus, Loader2, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface TrainingSession {
  id: string;
  session_date: string;
  end_time: string | null;
  location: string | null;
  tipe_sesi: 'teknik' | 'taktik' | 'fisik' | 'uji coba';
  team_name: string;
  kapasitas_lapangan: number | null;
}

/**
 * CoachSchedule Component
 * 
 * Modul Manajemen Jadwal Latihan untuk Pelatih.
 * Fitur:
 * 1. Kalender sesi latihan bulanan.
 * 2. Visualisasi tipe sesi (Teknik, Taktik, Fisik, Uji Coba) dengan kode warna.
 * 3. Detail sesi: Waktu mulai/selesai, kapasitas lapangan, dan tim yang diampu.
 * 
 * Alur Bisnis:
 * - Pelatih dapat melihat semua jadwal sesi yang ditugaskan kepada mereka.
 * - Tombol aksi untuk beralih ke halaman presensi untuk sesi yang sedang berlangsung.
 */
const CoachSchedule = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch sessions for the coach
        const { data, error } = await supabase
          .from("training_sessions")
          .select(`
            id, 
            session_date, 
            end_time,
            tipe_sesi,
            kapasitas_lapangan,
            teams (name)
          `)
          .order("session_date", { ascending: true });

        if (error) throw error;

        const formatted = data.map((s: any) => ({
          ...s,
          team_name: s.teams?.name || "No Team"
        }));

        setSessions(formatted);
      } catch (error: any) {
        console.error("Error fetching schedule:", error);
        toast.error("Gagal memuat jadwal");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const typeColors = {
    'teknik': 'bg-blue-100 text-blue-700 border-blue-200',
    'taktik': 'bg-purple-100 text-purple-700 border-purple-200',
    'fisik': 'bg-orange-100 text-orange-700 border-orange-200',
    'uji coba': 'bg-green-100 text-green-700 border-green-200',
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Jadwal Latihan</h1>
          <p className="text-xs text-muted-foreground">Manajemen sesi & kalender</p>
        </div>
        <Button size="sm" className="gap-1">
          <Plus className="w-4 h-4" /> Sesi
        </Button>
      </div>

      {/* Month Selector */}
      <div className="flex items-center justify-between bg-card border rounded-xl p-2 mb-6">
        <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="w-4 h-4" /></Button>
        <span className="font-bold text-sm">
          {currentMonth.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
        </span>
        <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="w-4 h-4" /></Button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-sm">Memuat jadwal...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
            Belum ada jadwal latihan yang terdaftar
          </div>
        ) : (
          sessions.map((session) => (
            <Card key={session.id} className="overflow-hidden border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Badge variant="outline" className={`capitalize text-[10px] ${typeColors[session.tipe_sesi]}`}>
                      {session.tipe_sesi}
                    </Badge>
                    <h3 className="font-bold text-foreground mt-1">{session.team_name}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-primary">
                      {new Date(session.session_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(session.session_date).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{session.location || "Lapangan Utama"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" />
                    <span>Target: {session.kapasitas_lapangan || 20} Pemain</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Durasi: 120 Menit</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-[10px]">
                    Detail
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="flex-1 h-8 text-[10px] gap-1 bg-green-600 hover:bg-green-700"
                    onClick={() => navigate(`/coach/attendance/${session.id}`)}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mulai Absen
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

export default CoachSchedule;
