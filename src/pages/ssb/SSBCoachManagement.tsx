import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  UserCog, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight, 
  ShieldCheck, 
  ShieldAlert, 
  Loader2, 
  Mail, 
  Phone, 
  FileText,
  UserPlus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Schema validasi untuk pendaftaran Coach baru
const coachSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  kontak: z.string().min(10, "Nomor telepon minimal 10 digit"),
  spesialisasi: z.string().min(3, "Spesialisasi minimal 3 karakter"),
  jenis_lisensi: z.enum(["A", "B", "C", "D"]),
  nomor_sertifikat: z.string().min(5, "Nomor sertifikat minimal 5 karakter"),
  lembaga_penerbit: z.string().min(3, "Lembaga minimal 3 karakter"),
  tgl_dikeluarkan: z.string().min(1, "Tanggal dikeluarkan wajib diisi"),
  tgl_kadaluarsa: z.string().min(1, "Tanggal kadaluarsa wajib diisi"),
  dokumen_sertifikat: z.any().optional(),
});

type CoachFormValues = z.infer<typeof coachSchema>;

interface CoachListItem {
  id: string;
  nama: string;
  email?: string;
  kontak: string;
  spesialisasi: string;
  status: string;
  jenis_lisensi?: string;
  verified: boolean;
}

/**
 * SSBCoachManagement Component
 * 
 * Modul Manajemen Pelatih untuk Admin SSB.
 * Fitur:
 * 1. Menampilkan daftar pelatih yang terdaftar di SSB.
 * 2. Pencarian dan filter status pelatih.
 * 3. Registrasi Akun Coach Baru (dengan Validasi & Role-based).
 * 4. Monitoring status verifikasi lisensi.
 */
const SSBCoachManagement = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [coaches, setCoaches] = useState<CoachListItem[]>([]);

  const form = useForm<CoachFormValues>({
    resolver: zodResolver(coachSchema),
    defaultValues: {
      nama: "",
      email: "",
      kontak: "",
      spesialisasi: "",
      jenis_lisensi: "C",
      nomor_sertifikat: "",
      lembaga_penerbit: "",
      tgl_dikeluarkan: "",
      tgl_kadaluarsa: "",
      dokumen_sertifikat: null,
    },
  });

  const fetchCoaches = useCallback(async () => {
    setIsFetching(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("ssb_coaches")
        .select(`
          status,
          coaches (
            id,
            nama,
            kontak,
            spesialisasi
          )
        `)
        .eq("ssb_id", session.user.id);

      if (error) throw error;

      const formatted = data.map((item: any) => ({
        id: item.coaches.id,
        nama: item.coaches.nama,
        kontak: item.coaches.kontak,
        spesialisasi: item.coaches.spesialisasi,
        status: item.status,
        verified: item.status === 'active'
      }));

      setCoaches(formatted);
    } catch (error: any) {
      console.error("Error fetching coaches:", error);
      toast.error("Gagal mengambil data pelatih");
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchCoaches();
  }, [fetchCoaches]);

  const onSubmit = async (values: CoachFormValues) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Sesi Anda telah berakhir. Silakan login kembali.");
        navigate("/login");
        return;
      }

      console.log("Session present, invoking function with user:", session.user.id);

      let certificateUrl = null;
      if (values.dokumen_sertifikat && values.dokumen_sertifikat.length > 0) {
        const file = values.dokumen_sertifikat[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `certificates/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('coach-documents')
          .upload(filePath, file);

        if (uploadError) {
          if (uploadError.message === "Bucket not found") {
            throw new Error("Penyimpanan (Storage Bucket) 'coach-documents' belum dibuat di Supabase Dashboard.");
          }
          throw uploadError;
        }
        certificateUrl = filePath;
      }

      // Memanggil Edge Function untuk mengundang Coach & membuat profil
      // Penting: Hapus field non-serializable (seperti FileList) dari payload
      const { dokumen_sertifikat, ...cleanValues } = values;
      
      const { data, error: functionError } = await supabase.functions.invoke("invite-coach", {
        body: { ...cleanValues, certificate_url: certificateUrl },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (functionError) {
        console.error("Function Invocation Error:", functionError);
        // Coba ambil detail error dari response jika ada
        if ((functionError as any).context) {
          try {
            const body = await (functionError as any).context.json();
            throw new Error(body.error || body.message || "Gagal memproses pendaftaran");
          } catch (e) {
            throw functionError;
          }
        }
        throw functionError;
      }
      
      if (data?.error) throw new Error(data.message || data.error);

      toast.success(data.message || "Akun Pelatih berhasil diundang.");
      setIsDialogOpen(false);
      form.reset();
      fetchCoaches();
    } catch (error: any) {
      console.error("Error registering coach:", error);
      toast.error(error.message || "Gagal mendaftarkan pelatih");
    } finally {
      setLoading(false);
    }
  };

  const filtered = coaches.filter((c) =>
    c.nama.toLowerCase().includes(search.toLowerCase()) ||
    c.spesialisasi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Manajemen Pelatih</h1>
          <p className="text-xs text-muted-foreground">Kelola staf pelatih SSB Anda</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <UserPlus className="w-4 h-4" /> Daftar Coach
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Daftarkan Pelatih Baru</DialogTitle>
              <DialogDescription>
                Isi data diri dan lisensi pelatih. Akun akan dibuat otomatis.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input placeholder="Coach Bambang" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Untuk Login)</FormLabel>
                      <FormControl>
                        <Input placeholder="coach@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="kontak"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp/HP</FormLabel>
                        <FormControl>
                          <Input placeholder="0812..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="spesialisasi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spesialisasi</FormLabel>
                        <FormControl>
                          <Input placeholder="GK / Taktik" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="text-sm font-semibold mb-3">Detail Lisensi</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="jenis_lisensi"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Jenis Lisensi</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Lisensi" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="A">Lisensi A</SelectItem>
                              <SelectItem value="B">Lisensi B</SelectItem>
                              <SelectItem value="C">Lisensi C</SelectItem>
                              <SelectItem value="D">Lisensi D</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nomor_sertifikat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>No. Sertifikat</FormLabel>
                          <FormControl>
                            <Input placeholder="CERT-123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="lembaga_penerbit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lembaga Penerbit</FormLabel>
                          <FormControl>
                            <Input placeholder="PSSI / AFC / FIFA" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="tgl_dikeluarkan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tgl. Dikeluarkan</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tgl_kadaluarsa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tgl. Kadaluarsa</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="dokumen_sertifikat"
                      render={({ field: { value, onChange, ...fieldProps } }) => (
                        <FormItem>
                          <FormLabel>Unggah Sertifikat (PDF/Image)</FormLabel>
                          <FormControl>
                            <Input 
                              type="file" 
                              accept="application/pdf,image/*" 
                              onChange={(e) => onChange(e.target.files)}
                              {...fieldProps} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Mendaftarkan...
                      </>
                    ) : (
                      "Kirim Undangan & Daftar"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cari pelatih atau spesialisasi..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {isFetching ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p className="text-sm">Memuat data staf pelatih...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl">
            <UserCog className="w-12 h-12 text-muted-foreground mx-auto opacity-20 mb-2" />
            <p className="text-sm text-muted-foreground">Belum ada pelatih terdaftar</p>
          </div>
        ) : (
          filtered.map((coach) => (
            <Card key={coach.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                    <UserCog className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm truncate">{coach.nama}</p>
                      {coach.verified ? (
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{coach.spesialisasi}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={coach.status === 'active' ? 'default' : 'secondary'} className="text-[10px] h-5">
                      {coach.status === 'active' ? 'Aktif' : 'Menunggu'}
                    </Badge>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Phone className="w-3 h-3" />
                    <span>{coach.kontak}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground justify-end">
                    <FileText className="w-3 h-3" />
                    <span>Lihat Dokumen</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SSBCoachManagement;
