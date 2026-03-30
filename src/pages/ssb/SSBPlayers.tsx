import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Filter, ChevronRight, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockPlayers } from "@/lib/mock-data";

const CURRENT_CLUB_ID = "club-1";

const SSBPlayers = () => {
  const [search, setSearch] = useState("");

  const clubPlayers = mockPlayers.filter((p) => p.clubId === CURRENT_CLUB_ID);
  const filtered = clubPlayers.filter((p) =>
    p.fullName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-foreground">Pemain</h1>
        <Button size="sm" className="gap-1">
          <Plus className="w-4 h-4" /> Tambah
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari pemain..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-2">
        {filtered.map((player) => (
          <Link key={player.id} to={`/ssb/players/${player.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer mb-2">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">
                    {player.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-medium text-foreground text-sm truncate">{player.fullName}</p>
                    {player.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {player.position} · {player.group}
                  </p>
                </div>
                <Badge variant={player.status === "active" ? "default" : "secondary"} className="text-[10px]">
                  {player.status === "active" ? "Aktif" : "Nonaktif"}
                </Badge>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SSBPlayers;
