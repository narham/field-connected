import { Card, CardContent } from "@/components/ui/card";
import { Users, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const OwnerMembers = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-bold">Database Anggota & Staf</h1>
        <p className="text-xs text-muted-foreground">Akses penuh terhadap seluruh database pemain, pelatih, dan karyawan.</p>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Cari anggota (Pemain/Pelatih/Staf)..." className="pl-10 h-12 text-sm shadow-sm" />
      </div>
      
      <Card className="border-dashed py-20 text-center">
        <CardContent className="flex flex-col items-center">
          <Users className="w-12 h-12 text-muted-foreground opacity-20 mb-4" />
          <h3 className="text-sm font-medium">Modul Master Data Sedang Disiapkan</h3>
          <p className="text-xs text-muted-foreground max-w-[250px] mt-2 italic">
            Fitur integrasi Master Data dari seluruh modul (SSB, Coach, Treasurer) sedang dalam tahap sinkronisasi.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerMembers;
