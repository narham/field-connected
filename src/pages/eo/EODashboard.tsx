import { Trophy, Users, CalendarDays, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Kompetisi Aktif", value: "3", icon: Trophy },
  { label: "Tim Terdaftar", value: "24", icon: Users },
  { label: "Pertandingan Minggu Ini", value: "8", icon: CalendarDays },
  { label: "Total Pemain", value: "312", icon: BarChart3 },
];

const recentCompetitions = [
  { name: "Liga Grassroots Jakarta U-12", teams: 8, status: "Berlangsung", matches: "12/28" },
  { name: "Piala Garuda U-14", teams: 16, status: "Pendaftaran", matches: "0/48" },
  { name: "Tournament Mini Soccer U-10", teams: 6, status: "Berlangsung", matches: "8/15" },
];

const EODashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview kompetisi dan event kamu</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{s.label}</span>
                <s.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kompetisi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCompetitions.map((c) => (
              <div key={c.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-foreground text-sm">{c.name}</p>
                  <p className="text-muted-foreground text-xs">{c.teams} tim · {c.matches} pertandingan</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  c.status === "Berlangsung" ? "bg-primary/10 text-primary" : "bg-warning/10 text-accent-foreground"
                }`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EODashboard;
