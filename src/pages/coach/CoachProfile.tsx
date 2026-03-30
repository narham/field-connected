import { useState, useEffect } from "react";
import { User, Award, Mail, MapPin, Phone, Camera, Edit, Save, Loader2, Calendar, Plus, Trash2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface CoachProfile {
  id: string;
  nama: string;
  foto_url: string | null;
  spesialisasi: string | null;
  kontak: string | null;
  alamat: string | null;
}

interface License {
  id: string;
  jenis_lisensi: string;
  nomor_sertifikat: string;
  lembaga_penerbit: string;
  tgl_dikeluarkan: string;
  tgl_kadaluarsa: string;
}

/**
 * CoachProfile Component
 * 
 * Modul Manajemen Profil & Lisensi Pelatih.
 * Fitur:
 * 1. Manajemen data diri (nama, spesialisasi, kontak, alamat).
 * 2. Unggah/Pembaruan foto profil.
 * 3. Manajemen lisensi (A, B, C, D) dengan tanggal kadaluarsa.
 * 
 * Data Bisnis:
 * - Data utama disimpan di tabel 'coaches'.
 * - Lisensi pelatih disimpan di tabel 'coach_licenses' (1:M).
 */
const CoachProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<CoachProfile | null>(null);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  
  // New License State
  const [isAddingLicense, setIsAddingLicense] = useState(false);
  const [newLicense, setNewLicense] = useState({
    jenis_lisensi: "C",
    nomor_sertifikat: "",
    lembaga_penerbit: "",
    tgl_dikeluarkan: "",
    tgl_kadaluarsa: ""
  });

  const fetchCoachData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Profile
      const { data: coachData, error: coachError } = await supabase
        .from("coaches")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (coachError && coachError.code !== "PGRST116") throw coachError;
      setProfile(coachData);

      // 2. Fetch Licenses
      if (coachData) {
        const { data: licenseData, error: licenseError } = await supabase
          .from("coach_licenses")
          .select("*")
          .eq("coach_id", coachData.id)
          .order("tgl_kadaluarsa", { ascending: false });
        
        if (licenseError) throw licenseError;
        setLicenses(licenseData || []);
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast.error("Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoachData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Unauthorized");

      const { error } = await supabase
        .from("coaches")
        .upsert({
          user_id: user.id,
          nama: profile?.nama,
          spesialisasi: profile?.spesialisasi,
          kontak: profile?.kontak,
          alamat: profile?.alamat,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success("Profil berhasil diperbarui");
      setIsEditing(false);
      fetchCoachData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddLicense = async () => {
    if (!profile?.id) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("coach_licenses")
        .insert({
          coach_id: profile.id,
          ...newLicense
        });

      if (error) throw error;
      toast.success("Lisensi berhasil ditambahkan");
      setIsAddingLicense(false);
      setNewLicense({
        jenis_lisensi: "C",
        nomor_sertifikat: "",
        lembaga_penerbit: "",
        tgl_dikeluarkan: "",
        tgl_kadaluarsa: ""
      });
      fetchCoachData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLicense = async (id: string) => {
    if (!confirm("Hapus lisensi ini?")) return;
    try {
      const { error } = await supabase
        .from("coach_licenses")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Lisensi dihapus");
      fetchCoachData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p className="text-sm">Memuat profil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Profil Pelatih</h1>
          <p className="text-xs text-muted-foreground">Informasi teknis & lisensi</p>
        </div>
        <Button 
          variant={isEditing ? "ghost" : "outline"} 
          size="sm" 
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? <X className="w-4 h-4 mr-1" /> : <Edit className="w-4 h-4 mr-1" />}
          {isEditing ? "Batal" : "Edit"}
        </Button>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Header Profile */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center border-4 border-background shadow-md overflow-hidden">
              {profile?.foto_url ? (
                <img src={profile.foto_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
            {isEditing && (
              <button type="button" className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full border-2 border-background">
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="text-center mt-3">
            {isEditing ? (
              <Input 
                className="h-8 text-center font-bold text-lg max-w-[200px]" 
                value={profile?.nama || ""} 
                onChange={e => setProfile(prev => ({ ...prev!, nama: e.target.value }))}
                placeholder="Nama Lengkap"
              />
            ) : (
              <h2 className="text-lg font-bold">{profile?.nama || "Belum diatur"}</h2>
            )}
            <Badge variant="secondary" className="mt-1 font-medium bg-primary/10 text-primary hover:bg-primary/20">
              {profile?.spesialisasi || "Pelatih Kepala"}
            </Badge>
          </div>
        </div>

        {/* Contact Info */}
        <Card className="border-none shadow-sm bg-muted/30">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center border shadow-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Kontak</p>
                {isEditing ? (
                  <Input 
                    className="h-8 mt-0.5" 
                    value={profile?.kontak || ""} 
                    onChange={e => setProfile(prev => ({ ...prev!, kontak: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm font-semibold">{profile?.kontak || "-"}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center border shadow-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Alamat</p>
                {isEditing ? (
                  <Input 
                    className="h-8 mt-0.5" 
                    value={profile?.alamat || ""} 
                    onChange={e => setProfile(prev => ({ ...prev!, alamat: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm font-semibold">{profile?.alamat || "-"}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center border shadow-sm">
                <Award className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Spesialisasi</p>
                {isEditing ? (
                  <Input 
                    className="h-8 mt-0.5" 
                    value={profile?.spesialisasi || ""} 
                    onChange={e => setProfile(prev => ({ ...prev!, spesialisasi: e.target.value }))}
                  />
                ) : (
                  <p className="text-sm font-semibold">{profile?.spesialisasi || "Generalist"}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {isEditing && (
          <Button type="submit" className="w-full gap-2" disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Perubahan
          </Button>
        )}
      </form>

      {/* Licenses Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Lisensi & Sertifikasi
          </h3>
          <Dialog open={isAddingLicense} onOpenChange={setIsAddingLicense}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-[10px] gap-1">
                <Plus className="w-3.5 h-3.5" /> Tambah
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] rounded-xl">
              <DialogHeader>
                <DialogTitle>Tambah Lisensi</DialogTitle>
                <DialogDescription>Masukkan detail lisensi kepelatihan Anda.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Jenis Lisensi</Label>
                  <Select 
                    value={newLicense.jenis_lisensi} 
                    onValueChange={val => setNewLicense(prev => ({ ...prev, jenis_lisensi: val }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih lisensi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Lisensi A</SelectItem>
                      <SelectItem value="B">Lisensi B</SelectItem>
                      <SelectItem value="C">Lisensi C</SelectItem>
                      <SelectItem value="D">Lisensi D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Nomor Sertifikat</Label>
                  <Input 
                    value={newLicense.nomor_sertifikat} 
                    onChange={e => setNewLicense(prev => ({ ...prev, nomor_sertifikat: e.target.value }))}
                    placeholder="Contoh: CERT/AFC/2024/001"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lembaga Penerbit</Label>
                  <Input 
                    value={newLicense.lembaga_penerbit} 
                    onChange={e => setNewLicense(prev => ({ ...prev, lembaga_penerbit: e.target.value }))}
                    placeholder="Contoh: PSSI / AFC"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tgl Dikeluarkan</Label>
                    <Input 
                      type="date" 
                      value={newLicense.tgl_dikeluarkan} 
                      onChange={e => setNewLicense(prev => ({ ...prev, tgl_dikeluarkan: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tgl Kadaluarsa</Label>
                    <Input 
                      type="date" 
                      value={newLicense.tgl_kadaluarsa} 
                      onChange={e => setNewLicense(prev => ({ ...prev, tgl_kadaluarsa: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingLicense(false)}>Batal</Button>
                <Button onClick={handleAddLicense} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Simpan Lisensi
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {licenses.length === 0 ? (
            <div className="text-center py-8 bg-muted/20 rounded-xl border border-dashed text-muted-foreground">
              <p className="text-xs">Belum ada data lisensi</p>
            </div>
          ) : (
            licenses.map((license) => (
              <Card key={license.id} className="relative group overflow-hidden border-l-4 border-l-primary/40">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-primary/80">Lisensi {license.jenis_lisensi}</Badge>
                        <span className="text-xs font-bold text-muted-foreground">{license.lembaga_penerbit}</span>
                      </div>
                      <h4 className="text-sm font-bold mt-2">{license.nomor_sertifikat}</h4>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Exp: {new Date(license.tgl_kadaluarsa).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteLicense(license.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachProfile;
