import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Clock, XCircle, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRegistrationsByClub } from "@/lib/mock-data";

const CURRENT_CLUB_ID = "club-1";

const statusConfig = {
  approved: { label: "Disetujui", icon: CheckCircle2, variant: "default" as const },
  pending: { label: "Menunggu", icon: Clock, variant: "secondary" as const },
  rejected: { label: "Ditolak", icon: XCircle, variant: "destructive" as const },
};

const SSBRegistrations = () => {
  const registrations = getRegistrationsByClub(CURRENT_CLUB_ID);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <Link to="/ssb/more" className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </Link>

      <h1 className="text-xl font-bold text-foreground mb-1">Pendaftaran Saya</h1>
      <p className="text-muted-foreground text-sm mb-6">Status pendaftaran tim ke kompetisi</p>

      {registrations.length === 0 ? (
        <Card className="bg-secondary/50 border-0">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground text-sm">Belum ada pendaftaran</p>
            <Link to="/ssb/competitions" className="text-primary text-sm font-medium mt-2 inline-block">
              Cari Kompetisi →
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {registrations.map((reg) => {
            const config = statusConfig[reg.status];
            return (
              <Card key={reg.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{reg.competitionName}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{reg.teamName} · {reg.categoryLabel}</p>
                    </div>
                    <Badge variant={config.variant} className="text-[10px] gap-1">
                      <config.icon className="w-3 h-3" />
                      {config.label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{reg.players.length} pemain terdaftar</span>
                    <span>
                      {new Date(reg.submittedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  {reg.locked && (
                    <Badge variant="outline" className="text-[9px] mt-2">🔒 Roster Terkunci</Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SSBRegistrations;
