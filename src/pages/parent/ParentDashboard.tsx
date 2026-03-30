import { useEffect, useState } from "react";
import { 
  Users, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  ArrowRight,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  User,
  Receipt
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Child {
  id: string;
  nama: string;
  posisi: string;
  status: string;
  current_team_id: string;
  teams: { name: string };
  attendance_rate: number;
}

interface BillSummary {
  unpaid_count: number;
  total_unpaid: number;
  latest_due_date: string | null;
}

/**
 * ParentDashboard Component
 * 
 * Dashboard utama untuk orang tua.
 * Menampilkan:
 * 1. Roster Anak (Multiple children support).
 * 2. Ringkasan Tagihan.
 * 3. Jadwal Latihan Terdekat.
 * 4. Notifikasi Aktivitas.
 */
const ParentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<Child[]>([]);
  const [billSummary, setBillSummary] = useState<BillSummary>({
    unpaid_count: 0,
    total_unpaid: 0,
    latest_due_date: null
  });
  const [nextSession, setNextSession] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 1. Get Parent Profile & Children
        const { data: parent } = await supabase
          .from("parents")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (!parent) return;

        const { data: relations } = await supabase
          .from("parent_players")
          .select("player_id, players(*, teams(name))")
          .eq("parent_id", parent.id);

        if (!relations) return;

        const childIds = relations.map(r => r.player_id);

        // 1b. Fetch Attendance for each child
        const { data: attendanceData } = await supabase
          .from("player_attendances")
          .select("player_id, status")
          .in("player_id", childIds);

        const attendanceMap = childIds.reduce((acc, id) => {
          const childAttendance = attendanceData?.filter(a => a.player_id === id) || [];
          const total = childAttendance.length;
          const present = childAttendance.filter(a => a.status === 'hadir').length;
          acc[id] = total > 0 ? Math.round((present / total) * 100) : 0;
          return acc;
        }, {} as Record<string, number>);

        const childrenList = relations.map((r: any) => ({
          id: r.players.id,
          nama: r.players.nama,
          posisi: r.players.posisi,
          status: r.players.status,
          current_team_id: r.players.current_team_id,
          teams: r.players.teams,
          attendance_rate: attendanceMap[r.players.id] || 0
        }));
        setChildren(childrenList);

        // 2. Fetch Bills Summary
        const { data: bills } = await supabase
          .from("player_bills")
          .select("nominal, due_date")
          .in("player_id", childIds)
          .eq("status", "unpaid");

        if (bills) {
          const total = bills.reduce((acc, b) => acc + Number(b.nominal), 0);
          const latest = bills.length > 0 ? bills.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0].due_date : null;
          setBillSummary({
            unpaid_count: bills.length,
            total_unpaid: total,
            latest_due_date: latest
          });
        }

        // 3. Fetch Next Training Session for any child
        if (childrenList.length > 0) {
          const teamIds = childrenList.map(c => c.current_team_id).filter(Boolean);
          const { data: sessions } = await supabase
            .from("training_sessions")
            .select("*, teams(name)")
            .in("team_id", teamIds)
            .gte("session_date", new Date().toISOString())
            .order("session_date", { ascending: true })
            .limit(1);
          
          if (sessions && sessions.length > 0) {
            setNextSession(sessions[0]);
          }
        }

      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
        toast.error("Gagal memuat data dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Clock className="w-8 h-8 animate-pulse text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Memuat ringkasan aktivitas...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Welcome Section */}
      <section>
        <h2 className="text-xl font-bold">Halo, Selamat Datang!</h2>
        <p className="text-xs text-muted-foreground">Pantau perkembangan anak Anda hari ini.</p>
      </section>

      {/* Bill Summary Card */}
      <Card className={`overflow-hidden border-none shadow-md ${billSummary.unpaid_count > 0 ? 'bg-amber-50' : 'bg-green-50'}`}>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${billSummary.unpaid_count > 0 ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Tagihan Aktif</p>
              <p className="text-lg font-bold">
                {billSummary.unpaid_count > 0 
                  ? `Rp ${billSummary.total_unpaid.toLocaleString("id-ID")}` 
                  : "Semua Lunas"}
              </p>
            </div>
          </div>
          <Button size="sm" variant={billSummary.unpaid_count > 0 ? "default" : "outline"} asChild>
            <Link to="/parent/bills">
              Bayar <ChevronRight className="w-3 h-3 ml-1" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Next Training Session */}
      {nextSession && (
        <Card className="shadow-sm border-slate-100">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Jadwal Terdekat
              </CardTitle>
              <Badge variant="secondary" className="text-[9px] px-1 h-4">{nextSession.tipe_sesi || "Latihan"}</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold uppercase leading-none">{new Date(nextSession.session_date).toLocaleDateString("id-ID", { month: 'short' })}</span>
              <span className="text-lg font-bold leading-none">{new Date(nextSession.session_date).getDate()}</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold">{nextSession.teams?.name}</h3>
              <p className="text-[10px] text-muted-foreground">Lapangan Utama • {new Date(nextSession.session_date).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' })} WIB</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Children Roster */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" /> Roster Anak
        </h3>
        <div className="grid gap-3">
          {children.map((child) => (
            <Link key={child.id} to={`/parent/progress/${child.id}`}>
              <Card className="hover:bg-slate-50 transition-colors shadow-none border-slate-100">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold">{child.nama}</h4>
                      <Badge variant="outline" className="text-[9px] h-4 uppercase">{child.posisi}</Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-2">{child.teams?.name || "Belum ada tim"}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px]">
                        <span>Kehadiran</span>
                        <span className="font-bold">{child.attendance_rate}%</span>
                      </div>
                      <Progress value={child.attendance_rate} className="h-1" />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 pb-4">
        <Button variant="outline" className="h-20 flex-col gap-2 text-xs border-slate-200" asChild>
          <Link to="/parent/progress">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Progres Anak
          </Link>
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2 text-xs border-slate-200" asChild>
          <Link to="/parent/bills">
            <Receipt className="w-5 h-5 text-amber-500" />
            Tagihan & Bayar
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ParentDashboard;
