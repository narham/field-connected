import { useEffect, useState } from "react";
import { 
  Settings, 
  Building2, 
  ShieldCheck, 
  FileText, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Plus, 
  Save, 
  Loader2,
  Trash2,
  ExternalLink,
  ChevronRight,
  Fingerprint,
  FileBadge
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const OwnerSettings = () => {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Pengaturan klub berhasil diperbarui.");
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      <header>
        <h1 className="text-xl font-bold">Pengaturan Strategis Klub</h1>
        <p className="text-xs text-muted-foreground">Kelola identitas, legalitas, dan konfigurasi tingkat tinggi organisasi.</p>
      </header>

      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl mb-6">
          <TabsTrigger value="identity" className="text-xs rounded-lg px-4 py-2">Identitas Klub</TabsTrigger>
          <TabsTrigger value="legal" className="text-xs rounded-lg px-4 py-2">Legalitas & Dokumen</TabsTrigger>
          <TabsTrigger value="owner" className="text-xs rounded-lg px-4 py-2">Profil Pemilik</TabsTrigger>
        </TabsList>

        {/* Club Identity Content */}
        <TabsContent value="identity" className="space-y-6 outline-none">
          <Card className="shadow-sm border-slate-100">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" /> Informasi Dasar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200 overflow-hidden shadow-inner">
                    <Building2 className="w-10 h-10 text-slate-300" />
                  </div>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full absolute -bottom-2 -right-2 shadow-lg bg-white">
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-bold">Logo Klub</h4>
                  <p className="text-[10px] text-muted-foreground">Rekomendasi ukuran 512x512px. Format PNG transparan.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold">Nama Resmi Klub</Label>
                  <Input defaultValue="SSB Field Connected Jakarta" className="h-10 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold">Tahun Berdiri</Label>
                  <Input type="number" defaultValue="2018" className="h-10 text-sm" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-xs font-bold">Visi & Misi</Label>
                  <Textarea placeholder="Tuliskan visi misi klub..." className="min-h-[100px] text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold">Website</Label>
                  <Input placeholder="https://..." className="h-10 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold">Email Official</Label>
                  <Input defaultValue="contact@fieldconnected.id" className="h-10 text-sm" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Legal Content */}
        <TabsContent value="legal" className="space-y-6 outline-none">
          <Card className="shadow-sm border-slate-100">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FileBadge className="w-4 h-4 text-primary" /> Dokumen Legalitas
              </CardTitle>
              <CardDescription className="text-[10px]">Dokumen ini diperlukan untuk verifikasi kompetisi resmi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'NIB (Nomor Induk Berusaha)', status: 'Verified', date: '12 Jan 2026' },
                { label: 'Akta Notaris Pendirian', status: 'Verified', date: '15 Jan 2026' },
                { label: 'Surat Izin Operasional', status: 'Expired', date: '01 Mar 2026', danger: true },
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", doc.danger ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600")}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold">{doc.label}</p>
                      <p className="text-[9px] text-muted-foreground">Diupload pada {doc.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={cn("text-[8px] h-4 uppercase", doc.danger ? "text-rose-600 border-rose-200" : "text-emerald-600 border-emerald-200")}>{doc.status}</Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-primary"><ExternalLink className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed border-2 h-12 text-xs gap-2">
                <Plus className="w-4 h-4" /> Tambah Dokumen Legal
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Owner Profile Content */}
        <TabsContent value="owner" className="space-y-6 outline-none">
          <Card className="shadow-sm border-slate-100">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Profil Pemilik & Otoritas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold">Nama Pemilik</Label>
                  <Input defaultValue="Mr. Owner SSB" className="h-10 text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold">NIK Pemilik</Label>
                  <Input defaultValue="3275000000000001" className="h-10 text-sm" />
                </div>
              </div>
              
              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Fingerprint className="w-3 h-3" /> Tanda Tangan Digital
                </h4>
                <div className="p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                  <p className="text-[10px] text-muted-foreground mb-4 italic">Gunakan area ini untuk mengunggah scan tanda tangan transparan Anda.</p>
                  <Button variant="outline" size="sm" className="text-xs">Upload Signature</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="pt-6 border-t flex justify-end">
        <Button size="lg" className="px-8 shadow-lg shadow-primary/20" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Simpan Konfigurasi Strategis
        </Button>
      </div>
    </div>
  );
};

export default OwnerSettings;
