import { Link } from "react-router-dom";
import { CheckCircle2, XCircle, Clock, Shield, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockRegistrations } from "@/lib/mock-data";

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
              {mockRegistrations.map((r) => {
                const config = statusConfig[r.status];
                const allValid = r.players.every((p) => p.ageValid);
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.teamName}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{r.competitionName}</TableCell>
                    <TableCell>{r.players.length}</TableCell>
                    <TableCell>
                      {allValid ? (
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
                      <Link to={`/eo/registrations/${r.id}`}>
                        <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                          Detail <ChevronRight className="w-3 h-3" />
                        </Button>
                      </Link>
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
