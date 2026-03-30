import { serve } from "std/http/server";
import { createClient } from "supabase";
import { corsHeaders } from "../_shared/cors.ts";

/**
 * Edge Function: invite-coach
 * 
 * Alur Kerja:
 * 1. Verifikasi token Admin SSB yang memanggil fungsi.
 * 2. Undang Coach baru melalui Supabase Auth (Admin API).
 * 3. Simpan profil Coach ke tabel 'coaches'.
 * 4. Simpan lisensi Coach ke tabel 'coach_licenses'.
 * 5. Hubungkan Coach ke SSB melalui tabel 'ssb_coaches'.
 * 6. Catat log ke 'coach_account_logs'.
 */

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", // Penting untuk bypass RLS pendaftaran
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 1. Dapatkan user dari token JWT (Admin SSB)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("Missing Authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized: Token autentikasi tidak ditemukan." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: adminUser }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !adminUser) {
      console.error("Auth Verification Error:", authError);
      return new Response(
        JSON.stringify({ error: "Unauthorized: Sesi Anda telah berakhir atau tidak valid." }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    // 2. Parse Body Request
    let body;
    try {
      body = await req.json();
      console.log("Request Body received:", body);
    } catch (e) {
      console.error("Error parsing JSON body:", e);
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const { 
      email, 
      nama, 
      kontak, 
      spesialisasi, 
      jenis_lisensi, 
      nomor_sertifikat, 
      lembaga_penerbit, 
      tgl_dikeluarkan, 
      tgl_kadaluarsa,
      certificate_url 
    } = body;

    // Validasi field wajib
    if (!email || !nama) {
      return new Response(JSON.stringify({ error: "Email dan Nama wajib diisi" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // 3. Buat akun Coach langsung via createUser (tanpa kirim email)
    const tempPassword = crypto.randomUUID().slice(0, 12) + "A1!";
    console.log("Creating user:", email);
    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { 
        role: "coach",
        full_name: nama,
        ssb_id: adminUser.id
      },
    });

    if (createError) {
      console.error("Supabase Auth Create Error:", createError);

      if (createError.message.includes("already been registered") || createError.message.includes("already exists")) {
        return new Response(JSON.stringify({ error: `Email ${email} sudah terdaftar di sistem.` }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
      return new Response(JSON.stringify({ error: createError.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    const newCoachUserId = authData.user.id;
    console.log("User created successfully, ID:", newCoachUserId);

    // 4. Panggil RPC untuk Pendaftaran Atomik di Database
    console.log("Calling RPC register_coach_atomic...");
    const { data: coachId, error: rpcError } = await supabaseAdmin.rpc("register_coach_atomic", {
      p_user_id: newCoachUserId,
      p_admin_id: adminUser.id,
      p_nama: nama,
      p_kontak: kontak,
      p_spesialisasi: spesialisasi,
      p_jenis_lisensi: jenis_lisensi,
      p_nomor_sertifikat: nomor_sertifikat,
      p_lembaga_penerbit: lembaga_penerbit,
      p_tgl_dikeluarkan: tgl_dikeluarkan,
      p_tgl_kadaluarsa: tgl_kadaluarsa,
      p_sertifikat_url: certificate_url
    });

    if (rpcError) {
      console.error("RPC register_coach_atomic Error:", rpcError);
      // Rollback Auth user jika DB gagal
      await supabaseAdmin.auth.admin.deleteUser(newCoachUserId);
      return new Response(JSON.stringify({ error: `Gagal menyimpan data ke database: ${rpcError.message}` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log("Coach registered successfully in DB, Coach ID:", coachId);
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Coach berhasil diundang. Email verifikasi telah dikirim.",
        coach_id: coachId 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error("Global Catch Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
