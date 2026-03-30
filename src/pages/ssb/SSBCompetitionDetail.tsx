import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Trophy, MapPin, Calendar, Users, Info, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCompetition, getRegistrationsByCompetition } from "@/lib/mock-data";

const formatLabel = {
  league: "Liga (Home & Away)",
  knockout: "Sistem Gugur (Knockout)",
  group_knockout: "Fase Grup + Knockout",
};

const SSBCompetitionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const competition = getCompetition(id || "");
  const registrations = getRegistrationsByCompetition(id || "");

  if (!competition) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 text-center">
        <p className="text-muted-foreground">Kompetisi tidak ditemukan</p>
        <Link to="/ssb/competitions">
          <Button variant="outline" className="mt-4">Kembali</Button>
        </Link>
      </div>
    );
  }

  const approvedTeams = registrations.filter((r) => r.status === "approved").length;
  const canRegister = competition.status === "open";

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      {/* Header */}
      <Link to="/ssb/competitions" className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
          <Trophy className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">{competition.name}</h1>
          <p className="text-muted-foreground text-sm">{competition.organizerName}</p>
        </div>
      </div>

      {/* Status & Categories */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge variant={competition.status === "open" ? "default" : "secondary"}>
          {competition.status === "open" ? "Pendaftaran Dibuka" : competition.status === "ongoing" ? "Berlangsung" : "Selesai"}
        </Badge>
        {competition.categories.map((cat) => (
          <Badge key={cat.id} variant="outline">{cat.label}</Badge>
        ))}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card>
          <CardContent className="p-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <div>
              <p className="text-[10px] text-muted-foreground">Tanggal</p>
              <p className="text-xs font-medium text-foreground">
                {new Date(competition.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })} - {new Date(competition.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <div>
              <p className="text-[10px] text-muted-foreground">Lokasi</p>
              <p className="text-xs font-medium text-foreground truncate">{competition.location.split(",")[0]}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary" />
            <div>
              <p className="text-[10px] text-muted-foreground">Format</p>
              <p className="text-xs font-medium text-foreground">{formatLabel[competition.format]}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <p className="text-[10px] text-muted-foreground">Slot Tim</p>
              <p className="text-xs font-medium text-foreground">{approvedTeams} / {competition.maxTeamsPerCategory}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Deskripsi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{competition.description}</p>
        </CardContent>
      </Card>

      {/* Validation Info */}
      <Card className="mb-6 bg-secondary/50 border-0">
        <CardContent className="p-4 flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <p className="font-medium text-foreground text-sm">Validasi Pemain Otomatis</p>
            <p className="text-muted-foreground text-xs">Umur pemain akan divalidasi secara otomatis saat pendaftaran</p>
          </div>
        </CardContent>
      </Card>

      {/* Registered Teams */}
      {registrations.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Tim Terdaftar ({registrations.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {registrations.map((reg) => (
              <div key={reg.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{reg.teamName}</p>
                  <p className="text-xs text-muted-foreground">{reg.clubName} · {reg.players.length} pemain</p>
                </div>
                <Badge variant={reg.status === "approved" ? "default" : "secondary"} className="text-[10px]">
                  {reg.status === "approved" ? "Disetujui" : reg.status === "pending" ? "Menunggu" : "Ditolak"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      {canRegister && (
        <Link to={`/ssb/competitions/${competition.id}/register`}>
          <Button className="w-full gap-2" size="lg">
            <Trophy className="w-4 h-4" />
            Daftarkan Tim
          </Button>
        </Link>
      )}
    </div>
  );
};

export default SSBCompetitionDetail;
