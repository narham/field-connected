import { Link } from "react-router-dom";
import { Trophy, MapPin, Calendar, Users, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockCompetitions } from "@/lib/mock-data";

const statusLabel = {
  open: "Pendaftaran Dibuka",
  ongoing: "Sedang Berlangsung",
  completed: "Selesai",
};

const statusVariant = {
  open: "default" as const,
  ongoing: "secondary" as const,
  completed: "outline" as const,
};

const formatLabel = {
  league: "Liga",
  knockout: "Knockout",
  group_knockout: "Grup + Knockout",
};

const SSBCompetitions = () => {
  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">Kompetisi Tersedia</h1>
        <p className="text-muted-foreground text-sm mt-1">Temukan dan ikuti kompetisi untuk tim kamu</p>
      </div>

      <div className="space-y-3">
        {mockCompetitions.map((comp) => (
          <Link key={comp.id} to={`/ssb/competitions/${comp.id}`}>
            <Card className="hover:shadow-md transition-shadow mb-3">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{comp.name}</p>
                      <p className="text-muted-foreground text-xs">{comp.organizerName}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground mt-1" />
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  <Badge variant={statusVariant[comp.status]} className="text-[10px]">
                    {statusLabel[comp.status]}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {formatLabel[comp.format]}
                  </Badge>
                  {comp.categories.map((cat) => (
                    <Badge key={cat.id} variant="secondary" className="text-[10px]">
                      {cat.label}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(comp.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })} - {new Date(comp.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {comp.location.split(",")[0]}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SSBCompetitions;
