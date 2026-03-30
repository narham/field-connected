import { Calendar, Clock, MapPin, Users, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const schedule = [
  { id: 1, day: "Senin", time: "07:00 - 09:00", group: "U-10", location: "Lapangan A", coach: "Coach Andi", status: "done" },
  { id: 2, day: "Senin", time: "15:00 - 17:00", group: "U-12", location: "Lapangan B", coach: "Coach Budi", status: "upcoming" },
  { id: 3, day: "Selasa", time: "07:00 - 09:00", group: "U-14", location: "Lapangan A", coach: "Coach Cahyo", status: "upcoming" },
  { id: 4, day: "Rabu", time: "07:00 - 09:00", group: "U-10", location: "Lapangan A", coach: "Coach Andi", status: "upcoming" },
  { id: 5, day: "Rabu", time: "15:00 - 17:00", group: "U-12", location: "Lapangan B", coach: "Coach Budi", status: "upcoming" },
];

const SSBTraining = () => {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-foreground">Jadwal Latihan</h1>
        <Button size="sm">+ Jadwal Baru</Button>
      </div>

      {/* Week selector */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 no-scrollbar">
        {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d, i) => (
          <button
            key={d}
            className={`flex flex-col items-center px-3 py-2 rounded-xl min-w-[48px] transition-colors ${
              i === 0 ? "bg-primary text-primary-foreground" : "bg-card border hover:border-primary/30"
            }`}
          >
            <span className="text-[10px] font-medium">{d}</span>
            <span className="text-sm font-bold">{24 + i}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {schedule.map((s) => (
          <Card key={s.id} className={s.status === "done" ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge variant={s.status === "done" ? "secondary" : "default"} className="text-[10px]">
                    {s.group}
                  </Badge>
                  {s.status === "done" && (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-7">
                  {s.status === "done" ? "Lihat Absen" : "Absensi"}
                </Button>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{s.day}, {s.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{s.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  <span>{s.coach}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SSBTraining;
