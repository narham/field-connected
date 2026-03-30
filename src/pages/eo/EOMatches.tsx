import { Link } from "react-router-dom";
import { CalendarDays, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockMatches } from "@/lib/mock-data";

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
        {mockMatches.map((m) => (
          <Link key={m.id} to={`/eo/matches/${m.id}`}>
            <Card className="hover:shadow-md transition-shadow mb-3">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground">{m.competitionName} · {m.categoryLabel}</span>
                  <Badge variant={m.status === "completed" ? "secondary" : m.status === "live" ? "destructive" : "default"}>
                    {m.status === "completed" ? "Selesai" : m.status === "live" ? "🔴 LIVE" : "Akan Datang"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1 text-right">
                    <p className="font-medium text-foreground text-sm">{m.homeTeamName}</p>
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
                    <p className="font-medium text-foreground text-sm">{m.awayTeamName}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">{m.date} · {m.time}</span>
                  <Button size="sm" variant="outline" className="h-7 text-xs" onClick={(e) => e.stopPropagation()}>
                    {m.status === "upcoming" ? "Input Skor" : "Detail"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EOMatches;
