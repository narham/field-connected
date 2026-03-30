import { CalendarDays, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const matches = [
  { id: 1, home: "SSB Garuda Muda", away: "SSB Rajawali", homeScore: 2, awayScore: 1, date: "15 Mar", time: "09:00", status: "completed", competition: "Liga U-12" },
  { id: 2, home: "SSB Bintang Timur", away: "SSB Elang Jaya", homeScore: null, awayScore: null, date: "16 Mar", time: "10:00", status: "upcoming", competition: "Liga U-12" },
  { id: 3, home: "SSB Mitra Bola", away: "SSB Garuda Muda", homeScore: null, awayScore: null, date: "16 Mar", time: "14:00", status: "upcoming", competition: "Mini Soccer U-10" },
  { id: 4, home: "SSB Rajawali", away: "SSB Bintang Timur", homeScore: 0, awayScore: 0, date: "15 Mar", time: "11:00", status: "completed", competition: "Liga U-12" },
  { id: 5, home: "SSB Elang Jaya", away: "SSB Mitra Bola", homeScore: null, awayScore: null, date: "17 Mar", time: "09:00", status: "live", competition: "Liga U-12" },
];

const EOMatches = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pertandingan</h1>
          <p className="text-muted-foreground text-sm mt-1">Jadwal dan hasil pertandingan</p>
        </div>
        <Button className="gap-2">
          <CalendarDays className="w-4 h-4" /> Buat Jadwal
        </Button>
      </div>

      <div className="space-y-3">
        {matches.map((m) => (
          <Card key={m.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">{m.competition}</span>
                <Badge variant={m.status === "completed" ? "secondary" : m.status === "live" ? "destructive" : "default"}>
                  {m.status === "completed" ? "Selesai" : m.status === "live" ? "🔴 LIVE" : "Akan Datang"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 text-right">
                  <p className="font-medium text-foreground text-sm">{m.home}</p>
                </div>
                <div className="px-4 text-center min-w-[80px]">
                  {m.status === "completed" || m.status === "live" ? (
                    <p className="text-2xl font-bold text-foreground">
                      {m.homeScore} - {m.awayScore}
                    </p>
                  ) : (
                    <div className="flex items-center gap-1 justify-center text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span className="text-sm">{m.time}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{m.away}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted-foreground">{m.date} · {m.time}</span>
                {m.status === "upcoming" && (
                  <Button size="sm" variant="outline" className="h-7 text-xs">Input Skor</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EOMatches;
