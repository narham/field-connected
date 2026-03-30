import { Plus, Search, Trophy, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const competitions = [
  { id: 1, name: "Liga Grassroots Jakarta U-12", format: "Group Stage + Knockout", category: "U-12", teams: 8, maxTeams: 8, startDate: "15 Mar 2026", status: "active" },
  { id: 2, name: "Piala Garuda U-14", format: "Knockout", category: "U-14", teams: 12, maxTeams: 16, startDate: "1 Apr 2026", status: "registration" },
  { id: 3, name: "Tournament Mini Soccer U-10", format: "Group Stage", category: "U-10", teams: 6, maxTeams: 8, startDate: "10 Mar 2026", status: "active" },
  { id: 4, name: "Festival Sepak Bola U-8", format: "Round Robin", category: "U-8", teams: 0, maxTeams: 12, startDate: "20 Apr 2026", status: "draft" },
];

const statusMap = {
  active: { label: "Berlangsung", variant: "default" as const },
  registration: { label: "Pendaftaran", variant: "secondary" as const },
  draft: { label: "Draft", variant: "outline" as const },
  completed: { label: "Selesai", variant: "secondary" as const },
};

const EOCompetitions = () => {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kompetisi</h1>
          <p className="text-muted-foreground text-sm mt-1">Kelola turnamen dan liga</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Buat Kompetisi
        </Button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Cari kompetisi..." className="pl-10" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {competitions.map((c) => {
          const status = statusMap[c.status as keyof typeof statusMap];
          return (
            <Card key={c.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{c.name}</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{c.startDate} · {c.format}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5" />
                    <span>{c.teams}/{c.maxTeams} tim · Kategori {c.category}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EOCompetitions;
