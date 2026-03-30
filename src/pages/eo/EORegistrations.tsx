import { CheckCircle2, XCircle, Clock, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const registrations = [
  { id: 1, team: "SSB Garuda Muda U-12", competition: "Liga Grassroots Jakarta U-12", players: 15, validated: true, status: "approved" },
  { id: 2, team: "SSB Rajawali U-12", competition: "Liga Grassroots Jakarta U-12", players: 14, validated: true, status: "approved" },
  { id: 3, team: "SSB Elang Jaya U-14", competition: "Piala Garuda U-14", players: 18, validated: false, status: "pending" },
  { id: 4, team: "SSB Bintang Timur U-14", competition: "Piala Garuda U-14", players: 16, validated: false, status: "pending" },
  { id: 5, team: "SSB Mitra Bola U-10", competition: "Tournament Mini Soccer U-10", players: 12, validated: true, status: "approved" },
];

const statusConfig = {
  approved: { label: "Disetujui", icon: CheckCircle2, color: "text-primary" },
  pending: { label: "Menunggu", icon: Clock, color: "text-warning" },
  rejected: { label: "Ditolak", icon: XCircle, color: "text-destructive" },
};

const EORegistrations = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Pendaftaran Tim</h1>
        <p className="text-muted-foreground text-sm mt-1">Kelola pendaftaran dan validasi pemain</p>
      </div>

      {/* Validation Info */}
      <Card className="mb-6 bg-secondary/50 border-0">
        <CardContent className="p-4 flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <p className="font-medium text-foreground text-sm">Validasi Pemain Otomatis</p>
            <p className="text-muted-foreground text-xs">Sistem otomatis memvalidasi umur pemain dari database terpusat</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pendaftaran Masuk</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tim</TableHead>
                <TableHead>Kompetisi</TableHead>
                <TableHead>Pemain</TableHead>
                <TableHead>Validasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((r) => {
                const config = statusConfig[r.status as keyof typeof statusConfig];
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.team}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{r.competition}</TableCell>
                    <TableCell>{r.players}</TableCell>
                    <TableCell>
                      {r.validated ? (
                        <Badge variant="default" className="text-[10px]">Valid</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">Belum</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 ${config.color}`}>
                        <config.icon className="w-3.5 h-3.5" />
                        <span className="text-sm">{config.label}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {r.status === "pending" && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="default" className="h-7 text-xs">Setujui</Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs">Tolak</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EORegistrations;
