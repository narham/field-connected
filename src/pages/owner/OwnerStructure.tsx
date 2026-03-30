import { Card, CardContent } from "@/components/ui/card";
import { Building2, Activity } from "lucide-react";

const OwnerStructure = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-bold">Struktur Organisasi & Tim</h1>
        <p className="text-xs text-muted-foreground">Kelola hierarki tim dan penempatan staf.</p>
      </header>
      
      <Card className="border-dashed py-20 text-center">
        <CardContent className="flex flex-col items-center">
          <Building2 className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
          <h3 className="text-sm font-medium">Modul Struktur Sedang Disiapkan</h3>
          <p className="text-xs text-muted-foreground max-w-[250px] mt-2 italic">
            Fitur pengaturan bagan organisasi dan relasi pelatih-tim akan segera tersedia.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerStructure;
