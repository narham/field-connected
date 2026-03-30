import { useState } from "react";
import { Search, Plus, Filter, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mockPlayers = [
  { id: 1, name: "Ahmad Fauzi", age: 12, position: "Forward", group: "U-12", status: "active" },
  { id: 2, name: "Budi Santoso", age: 10, position: "Midfielder", group: "U-10", status: "active" },
  { id: 3, name: "Cahyo Prasetyo", age: 14, position: "Defender", group: "U-14", status: "active" },
  { id: 4, name: "Dimas Ramadhan", age: 11, position: "Goalkeeper", group: "U-12", status: "inactive" },
  { id: 5, name: "Eko Wijaya", age: 9, position: "Forward", group: "U-10", status: "active" },
  { id: 6, name: "Farhan Hidayat", age: 13, position: "Midfielder", group: "U-14", status: "active" },
];

const SSBPlayers = () => {
  const [search, setSearch] = useState("");

  const filtered = mockPlayers.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
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
          <Card key={player.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-primary font-bold text-sm">
                  {player.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{player.name}</p>
                <p className="text-muted-foreground text-xs">
                  {player.position} · {player.group} · {player.age} tahun
                </p>
              </div>
              <Badge variant={player.status === "active" ? "default" : "secondary"} className="text-[10px]">
                {player.status === "active" ? "Aktif" : "Nonaktif"}
              </Badge>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SSBPlayers;
