import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, XCircle, Shield, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { mockRegistrations } from "@/lib/mock-data";

const EORegistrationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const registration = mockRegistrations.find((r) => r.id === id);

  if (!registration) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Pendaftaran tidak ditemukan</p>
      </div>
    );
  }

  const allValid = registration.players.every((p) => p.ageValid);
  const allDocsVerified = registration.players.every((p) => p.documentVerified);

  return (
    <div>
      <Link to="/eo/registrations" className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Pendaftaran
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{registration.teamName}</h1>
          <p className="text-muted-foreground text-sm mt-1">{registration.clubName} · {registration.competitionName}</p>
        </div>
        <Badge variant={registration.status === "approved" ? "default" : registration.status === "pending" ? "secondary" : "destructive"}>
          {registration.status === "approved" ? "Disetujui" : registration.status === "pending" ? "Menunggu" : "Ditolak"}
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{registration.players.length}</p>
            <p className="text-xs text-muted-foreground">Pemain</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className={`text-2xl font-bold ${allValid ? "text-primary" : "text-destructive"}`}>
              {registration.players.filter((p) => p.ageValid).length}/{registration.players.length}
            </p>
            <p className="text-xs text-muted-foreground">Umur Valid</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className={`text-2xl font-bold ${allDocsVerified ? "text-primary" : "text-accent"}`}>
              {registration.players.filter((p) => p.documentVerified).length}/{registration.players.length}
            </p>
            <p className="text-xs text-muted-foreground">Dokumen</p>
          </CardContent>
        </Card>
      </div>

      {/* Validation Status */}
      <Card className={`mb-6 border-0 ${allValid && allDocsVerified ? "bg-primary/10" : "bg-accent/10"}`}>
        <CardContent className="p-4 flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <p className="font-medium text-foreground text-sm">
              {allValid && allDocsVerified ? "Semua Validasi Lolos ✓" : "Ada Validasi Belum Lengkap"}
            </p>
            <p className="text-muted-foreground text-xs">
              {!allValid && "Beberapa pemain melebihi batas umur. "}
              {!allDocsVerified && "Beberapa dokumen belum diverifikasi."}
              {allValid && allDocsVerified && "Semua pemain memenuhi syarat umur dan dokumen terverifikasi."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Player Roster Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Roster Pemain</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Tanggal Lahir</TableHead>
                <TableHead>Umur</TableHead>
                <TableHead>Validasi</TableHead>
                <TableHead>Dokumen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registration.players.map((p) => (
                <TableRow key={p.playerId}>
                  <TableCell className="font-medium">{p.playerName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(p.birthDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </TableCell>
                  <TableCell>{p.ageAtCompetition} thn</TableCell>
                  <TableCell>
                    {p.ageValid ? (
                      <div className="flex items-center gap-1 text-primary">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-xs">Valid</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-destructive">
                        <XCircle className="w-3.5 h-3.5" />
                        <span className="text-xs">Invalid</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {p.documentVerified ? (
                      <Badge variant="default" className="text-[10px]">Verified</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">Belum</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Actions */}
      {registration.status === "pending" && (
        <div className="flex gap-3">
          <Button
            className="flex-1"
            onClick={() => toast.success("Pendaftaran disetujui!")}
            disabled={!allValid}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Setujui
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => toast.info("Pendaftaran ditolak")}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Tolak
          </Button>
        </div>
      )}
    </div>
  );
};

export default EORegistrationDetail;
