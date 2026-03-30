import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  LineChart as LucideLineChart, 
  PieChart as LucidePieChart, 
  Activity, 
  Award,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare
} from "lucide-react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Evaluation {
  id: string;
  parameter_teknis: number;
  parameter_fisik: number;
  parameter_mental: number;
  catatan_kualitatif: string;
  rekomendasi_posisi: string;
  created_at: string;
  coaches: { nama: string };
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444']; // Green, Amber, Red

const ParentProgress = () => {
  const { id: urlId } = useParams();
  const [loading, setLoading] = useState(true);
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(urlId || null);
  const [attendanceStats, setAttendanceStats] = useState<any[]>([]);
  const [paymentStats, setPaymentStats] = useState<any[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  useEffect(() => {
    const fetchChildren = async () => {
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
          .select("player_id, players(id, nama)")
          .eq("parent_id", parent.id);

        if (relations && relations.length > 0) {
          const childList = relations.map((r: any) => r.players);
          setChildren(childList);
          if (!selectedChildId) {
            setSelectedChildId(childList[0].id);
          }
        }
      } catch (error) {
        console.error("Fetch Children Error:", error);
      }
    };

    fetchChildren();
  }, []);

  useEffect(() => {
    if (!selectedChildId) return;

    const fetchProgressData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Attendance Stats
        const { data: attendance } = await supabase
          .from("player_attendances")
          .select("status")
          .eq("player_id", selectedChildId);

        if (attendance) {
          const total = attendance.length;
          const hadir = attendance.filter(a => a.status === 'hadir').length;
          const izin = attendance.filter(a => a.status === 'izin').length;
          const alpha = attendance.filter(a => a.status === 'alpha').length;
          
          setAttendanceStats([
            { name: 'Hadir', value: hadir },
            { name: 'Izin', value: izin },
            { name: 'Alpha', value: alpha },
          ]);
        }

        // 2. Fetch Payment Stats (Last 6 months)
        const { data: bills } = await supabase
          .from("player_bills")
          .select("periode, nominal, status")
          .eq("player_id", selectedChildId)
          .order("due_date", { ascending: true })
          .limit(6);

        if (bills) {
          const stats = bills.map(b => ({
            name: b.periode,
            total: Number(b.nominal),
            paid: b.status === 'paid' ? Number(b.nominal) : 0
          }));
          setPaymentStats(stats);
        }

        // 3. Fetch Evaluations
        const { data: evals } = await supabase
          .from("coach_evaluations")
          .select("*, coaches(nama)")
          .eq("player_id", selectedChildId)
          .order("created_at", { ascending: false });
        
        setEvaluations(evals || []);

      } catch (error) {
        console.error("Fetch Progress Error:", error);
        toast.error("Gagal memuat data statistik.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [selectedChildId]);

  if (loading && children.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Memuat data progres...</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6 pb-12">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Perkembangan Anak</h2>
          <p className="text-xs text-muted-foreground">Statistik performa dan evaluasi.</p>
        </div>
        {children.length > 1 && (
          <Select value={selectedChildId || ""} onValueChange={setSelectedChildId}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Pilih Anak" />
            </SelectTrigger>
            <SelectContent>
              {children.map(child => (
                <SelectItem key={child.id} value={child.id}>{child.nama}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </header>

      {/* Attendance Pie Chart */}
      <Card className="shadow-sm border-slate-100">
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <LucidePieChart className="w-4 h-4 text-emerald-500" /> Grafik Kehadiran
          </CardTitle>
          <CardDescription className="text-[10px]">Persentase kehadiran dalam sesi latihan.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 h-[200px]">
          {attendanceStats.some(s => s.value > 0) ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {attendanceStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <Calendar className="w-8 h-8 opacity-20 mb-2" />
              <p className="text-[10px]">Belum ada data kehadiran.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Line Chart */}
      <Card className="shadow-sm border-slate-100">
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <LucideLineChart className="w-4 h-4 text-blue-500" /> Statistik Pembayaran
          </CardTitle>
          <CardDescription className="text-[10px]">Total tagihan vs total bayar (6 bulan terakhir).</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-4 h-[200px]">
          {paymentStats.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={paymentStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp${value/1000}k`} />
                <Tooltip />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', top: -10 }} />
                <Line type="monotone" dataKey="total" name="Tagihan" stroke="#94a3b8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="paid" name="Terbayar" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <LucideLineChart className="w-8 h-8 opacity-20 mb-2" />
              <p className="text-[10px]">Belum ada data pembayaran.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Coach Evaluations */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" /> Evaluasi Pelatih
        </h3>
        <div className="space-y-3">
          {evaluations.length === 0 ? (
            <Card className="border-dashed py-8 text-center">
              <MessageSquare className="w-10 h-10 text-muted-foreground opacity-20 mx-auto mb-2" />
              <p className="text-[10px] text-muted-foreground">Belum ada evaluasi dari pelatih.</p>
            </Card>
          ) : (
            evaluations.map((evalItem) => (
              <Card key={evalItem.id} className="shadow-none border-slate-100 overflow-hidden">
                <CardHeader className="p-3 bg-slate-50 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Award className="w-3 h-3 text-amber-500" />
                    </div>
                    <span className="text-[10px] font-bold">Oleh: {evalItem.coaches?.nama}</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground">
                    {new Date(evalItem.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                  </span>
                </CardHeader>
                <CardContent className="p-3 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2 rounded-lg bg-blue-50/50">
                      <p className="text-[8px] text-blue-600 font-bold uppercase mb-1">Teknis</p>
                      <p className="text-lg font-bold text-blue-700">{evalItem.parameter_teknis}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-emerald-50/50">
                      <p className="text-[8px] text-emerald-600 font-bold uppercase mb-1">Fisik</p>
                      <p className="text-lg font-bold text-emerald-700">{evalItem.parameter_fisik}</p>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-amber-50/50">
                      <p className="text-[8px] text-amber-600 font-bold uppercase mb-1">Mental</p>
                      <p className="text-lg font-bold text-amber-700">{evalItem.parameter_mental}</p>
                    </div>
                  </div>
                  
                  {evalItem.catatan_kualitatif && (
                    <div className="bg-slate-50 p-2 rounded-lg">
                      <p className="text-[9px] font-bold mb-1 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-slate-400" /> Catatan Pelatih:
                      </p>
                      <p className="text-[10px] text-slate-600 italic leading-relaxed">
                        "{evalItem.catatan_kualitatif}"
                      </p>
                    </div>
                  )}
                  
                  {evalItem.rekomendasi_posisi && (
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-muted-foreground">Rekomendasi Posisi:</span>
                      <Badge variant="outline" className="text-[8px] h-4 uppercase">{evalItem.rekomendasi_posisi}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default ParentProgress;
