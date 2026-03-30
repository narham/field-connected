import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Trophy, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { mockMatches, mockRegistrations, getPlayer, type MatchEvent } from "@/lib/mock-data";

const eventTypeLabels = {
  goal: "⚽ Gol",
  assist: "👟 Assist",
  yellow_card: "🟨 Kartu Kuning",
  red_card: "🟥 Kartu Merah",
};

const EOMatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const match = mockMatches.find((m) => m.id === id);

  const [events, setEvents] = useState<MatchEvent[]>(match?.events || []);
  const [newEventType, setNewEventType] = useState<string>("");
  const [newEventPlayerId, setNewEventPlayerId] = useState<string>("");
  const [newEventTeamId, setNewEventTeamId] = useState<string>("");
  const [newEventMinute, setNewEventMinute] = useState<string>("");

  if (!match) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Pertandingan tidak ditemukan</p>
      </div>
    );
  }

  // Get rosters from registrations
  const homeReg = mockRegistrations.find(
    (r) => r.competitionId === match.competitionId && r.teamId === match.homeTeamId && r.status === "approved"
  );
  const awayReg = mockRegistrations.find(
    (r) => r.competitionId === match.competitionId && r.teamId === match.awayTeamId && r.status === "approved"
  );

  const allRosterPlayers = [
    ...(homeReg?.players.map((p) => ({ ...p, teamId: match.homeTeamId, teamName: match.homeTeamName })) || []),
    ...(awayReg?.players.map((p) => ({ ...p, teamId: match.awayTeamId, teamName: match.awayTeamName })) || []),
  ];

  const selectedTeamPlayers = allRosterPlayers.filter((p) => p.teamId === newEventTeamId);

  const addEvent = () => {
    if (!newEventType || !newEventPlayerId || !newEventTeamId || !newEventMinute) {
      toast.error("Lengkapi semua field");
      return;
    }
    const player = allRosterPlayers.find((p) => p.playerId === newEventPlayerId);
    const evt: MatchEvent = {
      id: `evt-new-${Date.now()}`,
      matchId: match.id,
      playerId: newEventPlayerId,
      playerName: player?.playerName || "",
      teamId: newEventTeamId,
      type: newEventType as MatchEvent["type"],
      minute: parseInt(newEventMinute),
    };
    setEvents((prev) => [...prev, evt].sort((a, b) => a.minute - b.minute));
    setNewEventType("");
    setNewEventPlayerId("");
    setNewEventMinute("");
    toast.success("Event ditambahkan");
  };

  const homeGoals = events.filter((e) => e.teamId === match.homeTeamId && e.type === "goal").length;
  const awayGoals = events.filter((e) => e.teamId === match.awayTeamId && e.type === "goal").length;

  return (
    <div>
      <Link to="/eo/matches" className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Pertandingan
      </Link>

      {/* Match Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">{match.competitionName} · {match.categoryLabel}</span>
            <Badge variant={match.status === "completed" ? "secondary" : match.status === "live" ? "destructive" : "default"}>
              {match.status === "completed" ? "Selesai" : match.status === "live" ? "🔴 LIVE" : "Akan Datang"}
            </Badge>
          </div>
          <div className="flex items-center justify-center gap-6 py-4">
            <div className="text-right flex-1">
              <p className="font-bold text-foreground">{match.homeTeamName}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-foreground">{homeGoals} - {awayGoals}</p>
              <p className="text-xs text-muted-foreground mt-1">{match.date} · {match.time}</p>
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground">{match.awayTeamName}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lineups */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{match.homeTeamName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {homeReg?.players.map((p) => (
              <div key={p.playerId} className="flex items-center gap-2 py-1">
                <User className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-foreground">{p.playerName}</span>
              </div>
            )) || <p className="text-xs text-muted-foreground">Belum ada roster</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{match.awayTeamName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {awayReg?.players.map((p) => (
              <div key={p.playerId} className="flex items-center gap-2 py-1">
                <User className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-foreground">{p.playerName}</span>
              </div>
            )) || <p className="text-xs text-muted-foreground">Belum ada roster</p>}
          </CardContent>
        </Card>
      </div>

      {/* Add Event */}
      {match.status !== "completed" && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm">Tambah Event</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Select value={newEventTeamId} onValueChange={(v) => { setNewEventTeamId(v); setNewEventPlayerId(""); }}>
                <SelectTrigger><SelectValue placeholder="Tim" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={match.homeTeamId}>{match.homeTeamName}</SelectItem>
                  <SelectItem value={match.awayTeamId}>{match.awayTeamName}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={newEventPlayerId} onValueChange={setNewEventPlayerId}>
                <SelectTrigger><SelectValue placeholder="Pemain" /></SelectTrigger>
                <SelectContent>
                  {selectedTeamPlayers.map((p) => (
                    <SelectItem key={p.playerId} value={p.playerId}>{p.playerName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={newEventType} onValueChange={setNewEventType}>
                <SelectTrigger><SelectValue placeholder="Tipe" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="goal">⚽ Gol</SelectItem>
                  <SelectItem value="assist">👟 Assist</SelectItem>
                  <SelectItem value="yellow_card">🟨 Kartu Kuning</SelectItem>
                  <SelectItem value="red_card">🟥 Kartu Merah</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Menit"
                value={newEventMinute}
                onChange={(e) => setNewEventMinute(e.target.value)}
              />
            </div>
            <Button onClick={addEvent} className="w-full gap-2" size="sm">
              <Plus className="w-4 h-4" /> Tambah Event
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Events Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Event Pertandingan ({events.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Belum ada event</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Menit</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Pemain</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((evt) => (
                  <TableRow key={evt.id}>
                    <TableCell className="font-mono text-sm">{evt.minute}'</TableCell>
                    <TableCell>
                      <span className="text-sm">{eventTypeLabels[evt.type]}</span>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-foreground">{evt.playerName}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {evt.teamId === match.homeTeamId ? match.homeTeamName : match.awayTeamName}
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EOMatchDetail;
