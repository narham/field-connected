import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, Shield, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { getCompetition, getClubTeams, mockPlayers } from "@/lib/mock-data";
import { validatePlayerAge } from "@/lib/validation";

// Mock: current club is club-1 (SSB Garuda Muda)
const CURRENT_CLUB_ID = "club-1";

const SSBCompetitionRegister = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const competition = getCompetition(id || "");

  const [step, setStep] = useState<"team" | "roster" | "review">("team");
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);

  if (!competition) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 text-center">
        <p className="text-muted-foreground">Kompetisi tidak ditemukan</p>
      </div>
    );
  }

  const clubTeams = getClubTeams(CURRENT_CLUB_ID);
  // Filter teams matching competition categories
  const eligibleTeams = clubTeams.filter((t) =>
    competition.categories.some((cat) => cat.label === t.category)
  );

  const selectedTeam = clubTeams.find((t) => t.id === selectedTeamId);
  const category = competition.categories.find((cat) => selectedTeam && cat.label === selectedTeam.category);

  // Get players in the selected team
  const teamPlayers = selectedTeam
    ? mockPlayers.filter((p) => selectedTeam.players.includes(p.id) && p.status === "active")
    : [];

  const togglePlayer = (playerId: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId) ? prev.filter((id) => id !== playerId) : [...prev, playerId]
    );
  };

  const validatedPlayers = teamPlayers.map((p) => {
    const validation = category
      ? validatePlayerAge(p.birthDate, category.ageLimit, competition.startDate)
      : { valid: true, age: 0, reason: "" };
    return { ...p, validation, selected: selectedPlayerIds.includes(p.id) };
  });

  const selectedValid = validatedPlayers.filter((p) => p.selected);
  const hasInvalidSelected = selectedValid.some((p) => !p.validation.valid);

  const handleSubmit = () => {
    if (hasInvalidSelected) {
      toast.error("Tidak bisa mendaftarkan pemain yang tidak valid umurnya");
      return;
    }
    toast.success("Pendaftaran berhasil dikirim! Menunggu persetujuan EO.");
    navigate("/ssb/registrations");
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <Link to={`/ssb/competitions/${competition.id}`} className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      <h1 className="text-lg font-bold text-foreground mb-1">Daftarkan Tim</h1>
      <p className="text-muted-foreground text-sm mb-6">{competition.name}</p>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-6">
        {["Pilih Tim", "Pilih Pemain", "Review"].map((label, i) => {
          const stepNames = ["team", "roster", "review"] as const;
          const isActive = step === stepNames[i];
          const isDone = stepNames.indexOf(step) > i;
          return (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isActive ? "bg-primary text-primary-foreground" : isDone ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"}`}>
                {isDone ? "✓" : i + 1}
              </div>
              <span className={`text-xs ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}>{label}</span>
            </div>
          );
        })}
      </div>

      {/* Step 1: Select Team */}
      {step === "team" && (
        <div className="space-y-3">
          {eligibleTeams.length === 0 ? (
            <Card className="bg-secondary/50 border-0">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-sm text-foreground font-medium">Tidak ada tim yang sesuai</p>
                <p className="text-xs text-muted-foreground">Kategori kompetisi: {competition.categories.map((c) => c.label).join(", ")}</p>
              </CardContent>
            </Card>
          ) : (
            eligibleTeams.map((team) => (
              <Card
                key={team.id}
                className={`cursor-pointer transition-all ${selectedTeamId === team.id ? "ring-2 ring-primary" : "hover:shadow-md"}`}
                onClick={() => setSelectedTeamId(team.id)}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedTeamId === team.id ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"}`}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{team.name}</p>
                    <p className="text-muted-foreground text-xs">{team.players.length} pemain · {team.category}</p>
                  </div>
                  {selectedTeamId === team.id && (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  )}
                </CardContent>
              </Card>
            ))
          )}
          {selectedTeamId && (
            <Button className="w-full mt-4" onClick={() => { setStep("roster"); setSelectedPlayerIds([]); }}>
              Lanjut Pilih Pemain
            </Button>
          )}
        </div>
      )}

      {/* Step 2: Select Players (Roster) */}
      {step === "roster" && (
        <div>
          <Card className="mb-4 bg-secondary/50 border-0">
            <CardContent className="p-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <p className="text-xs text-muted-foreground">
                Validasi umur otomatis untuk kategori <strong>{category?.label}</strong> (maks {category?.ageLimit} tahun)
              </p>
            </CardContent>
          </Card>

          <div className="space-y-2">
            {validatedPlayers.map((p) => (
              <Card key={p.id} className={`transition-all ${!p.validation.valid ? "border-destructive/50" : ""}`}>
                <CardContent className="p-3 flex items-center gap-3">
                  <Checkbox
                    checked={selectedPlayerIds.includes(p.id)}
                    onCheckedChange={() => togglePlayer(p.id)}
                    disabled={!p.validation.valid}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{p.fullName}</p>
                      {p.verified && (
                        <Badge variant="default" className="text-[8px] px-1.5 py-0">GID</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{p.position} · {p.validation.age} tahun</p>
                  </div>
                  {p.validation.valid ? (
                    <div className="flex items-center gap-1 text-primary">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-[10px]">Valid</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-destructive">
                      <XCircle className="w-4 h-4" />
                      <span className="text-[10px]">Invalid</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setStep("team")}>Kembali</Button>
            <Button className="flex-1" disabled={selectedPlayerIds.length === 0} onClick={() => setStep("review")}>
              Review ({selectedPlayerIds.length} pemain)
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === "review" && (
        <div>
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Ringkasan Pendaftaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kompetisi</span>
                <span className="font-medium text-foreground">{competition.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kategori</span>
                <span className="font-medium text-foreground">{category?.label}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tim</span>
                <span className="font-medium text-foreground">{selectedTeam?.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Jumlah Pemain</span>
                <span className="font-medium text-foreground">{selectedPlayerIds.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Roster Pemain</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedValid.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground">{p.fullName}</span>
                    {p.verified && <Badge variant="default" className="text-[8px] px-1.5 py-0">GID</Badge>}
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[10px]">{p.validation.age} thn</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {hasInvalidSelected && (
            <Card className="mb-4 border-destructive bg-destructive/5">
              <CardContent className="p-3 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-destructive" />
                <p className="text-xs text-destructive">Ada pemain yang tidak valid. Hapus pemain tersebut untuk melanjutkan.</p>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setStep("roster")}>Kembali</Button>
            <Button className="flex-1" disabled={hasInvalidSelected || selectedPlayerIds.length === 0} onClick={handleSubmit}>
              Kirim Pendaftaran
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SSBCompetitionRegister;
