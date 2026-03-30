import { useEffect, useState } from "react";
import { 
  Settings, 
  Shield, 
  Mail, 
  Bell, 
  Building2, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Loader2,
  Lock,
  User,
  CreditCard,
  Save,
  Palette,
  Signature
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const TreasurerSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Pengaturan berhasil disimpan.");
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      <header>
        <h1 className="text-xl font-bold">Pengaturan Sistem Keuangan</h1>
        <p className="text-xs text-muted-foreground">Konfigurasi format invoice, notifikasi, dan profil bendahara.</p>
      </header>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl mb-6">
          <TabsTrigger value="profile" className="text-xs rounded-lg px-4 py-2">Profil & Akun</TabsTrigger>
          <TabsTrigger value="invoice" className="text-xs rounded-lg px-4 py-2">Format Invoice</TabsTrigger>
          <TabsTrigger value="notification" className="text-xs rounded-lg px-4 py-2">Notifikasi & Reminder</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6 outline-none">
          <Card className="shadow-sm border-slate-100 overflow-hidden">
            <CardHeader className="p-6 pb-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Informasi Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200 overflow-hidden">
                    <User className="w-8 h-8 text-slate-300" />
                  </div>
                  <Button variant="outline" size="icon" className="h-7 w-7 rounded-full absolute -bottom-2 -right-2 shadow-lg bg-white">
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-bold">Foto Profil</h4>
                  <p className="text-[10px] text-muted-foreground">Format JPG/PNG, maksimal 1MB. Tanda tangan digital diperlukan untuk invoice PDF.</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs">Nama Lengkap</Label>
                  <Input defaultValue="Andi Bendahara" className="text-sm h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Nomor Induk Karyawan (NIK)</Label>
                  <Input defaultValue="3275001234567890" className="text-sm h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Nomor WhatsApp</Label>
                  <Input defaultValue="08123456789" className="text-sm h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Nomor Rekening Operasional</Label>
                  <Input defaultValue="8801234567890 (Mandiri)" className="text-sm h-10" />
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end">
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Simpan Perubahan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoice Config */}
        <TabsContent value="invoice" className="space-y-6 outline-none">
          <Card className="shadow-sm border-slate-100">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" /> Konfigurasi Invoice
              </CardTitle>
              <CardDescription className="text-xs">Atur penomoran dan tampilan tagihan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs">Prefix Nomor Invoice</Label>
                  <Input defaultValue="INV/SSB-JKT/" className="text-sm h-10" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Tenggang Waktu (Jatuh Tempo)</Label>
                  <div className="flex items-center gap-2">
                    <Input type="number" defaultValue="15" className="text-sm h-10 w-24" />
                    <span className="text-xs text-muted-foreground">Hari setelah terbit</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Item Tagihan Standar</h4>
                <div className="grid gap-3">
                  {[
                    { label: 'SPP Bulanan', amount: 'Rp 450.000', active: true },
                    { label: 'Biaya Pendaftaran', amount: 'Rp 1.500.000', active: true },
                    { label: 'Uang Makan / Transport', amount: 'Rp 150.000', active: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <Switch checked={item.active} />
                        <div>
                          <p className="text-xs font-bold">{item.label}</p>
                          <p className="text-[10px] text-muted-foreground">{item.amount}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Settings className="w-4 h-4" /></Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Config */}
        <TabsContent value="notification" className="space-y-6 outline-none">
          <Card className="shadow-sm border-slate-100">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" /> Notifikasi & Pengingat Otomatis
              </CardTitle>
              <CardDescription className="text-xs">Atur kapan pengingat tagihan dikirim ke orang tua.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="space-y-1">
                    <p className="text-xs font-bold">Kirim Invoice Baru via Email</p>
                    <p className="text-[10px] text-muted-foreground">Kirim PDF otomatis saat invoice dibuat.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="space-y-1">
                    <p className="text-xs font-bold">Pengingat WhatsApp Otomatis</p>
                    <p className="text-[10px] text-muted-foreground">Gunakan Official WA API untuk reminder.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div className="space-y-1">
                    <p className="text-xs font-bold">Approval Invoice Manual</p>
                    <p className="text-[10px] text-muted-foreground">Minta verifikasi admin sebelum tagihan terbit.</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Jadwal Reminder</h4>
                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="p-3 border rounded-xl text-center space-y-2">
                    <p className="text-[10px] font-bold">H-3 Jatuh Tempo</p>
                    <Switch defaultChecked className="mx-auto" />
                  </div>
                  <div className="p-3 border rounded-xl text-center space-y-2">
                    <p className="text-[10px] font-bold">H-1 Jatuh Tempo</p>
                    <Switch defaultChecked className="mx-auto" />
                  </div>
                  <div className="p-3 border rounded-xl text-center space-y-2 border-primary bg-primary/5">
                    <p className="text-[10px] font-bold">H+1 Terlambat</p>
                    <Switch defaultChecked className="mx-auto" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TreasurerSettings;

import { Plus } from "lucide-react";
