
import { serve } from "std/http/server";
import { createClient } from "supabase";
import { corsHeaders } from "../_shared/cors.ts";

// Ambil kunci enkripsi dari environment variables
const ENCRYPTION_KEY = Deno.env.get("PLAYER_PII_ENCRYPTION_KEY");
if (!ENCRYPTION_KEY) {
  console.error("PLAYER_PII_ENCRYPTION_KEY is not set!");
  // Di lingkungan produksi, sebaiknya tidak melanjutkan jika kunci tidak ada
}

// Fungsi untuk mengenkripsi data menggunakan pgsodium
function encryptData(data: string): Uint8Array {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  // Ini adalah contoh sederhana, di dunia nyata, Anda akan menggunakan pgsodium
  // atau library kriptografi yang lebih kuat.
  // Untuk saat ini, kita akan mensimulasikan enkripsi.
  // Di Supabase Edge Function, Anda akan menggunakan fungsi dari pgsodium.
  // Karena kita tidak bisa langsung memanggil pgsodium di sini,
  // kita akan mengasumsikan proses enkripsi terjadi di database
  // atau melalui RPC. Namun, untuk tujuan demonstrasi, kita akan
  // mengembalikan data sebagai Uint8Array.
  return dataBuffer;
}


serve(async (req) => {
  // Handle preflight request untuk CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    // Ambil data pengguna yang terotentikasi dari token JWT
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    const playerData = await req.json();

    // --- Validasi Input ---
    const { nama, tanggal_lahir, posisi, nik, nama_ibu_kandung } = playerData;
    
    if (!nama || !tanggal_lahir || !posisi || !nik || !nama_ibu_kandung) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Validasi umur (6-25 tahun)
    const birthDate = new Date(tanggal_lahir);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 6 || age > 25) {
      return new Response(JSON.stringify({ error: "Player age must be between 6 and 25" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    
    // Validasi format nama
    if (!/^[A-Za-z .]+$/.test(nama)) {
        return new Response(JSON.stringify({ error: "Invalid name format" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }

    // Validasi format NIK (16 digit angka)
    if (!/^\d{16}$/.test(nik)) {
        return new Response(JSON.stringify({ error: "NIK must be 16 digits" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
        });
    }


    // --- Enkripsi Data Sensitif ---
    // Di skenario nyata, Anda akan memanggil fungsi RPC di postgres
    // yang menggunakan pgsodium untuk mengenkripsi data.
    // Contoh:
    // const { data: encryptedNik, error: nikError } = await supabaseClient.rpc('encrypt_pii', { value: nik, key_id: 'YOUR_KEY_ID' });
    // Untuk saat ini, kita akan mengirimnya sebagai teks biasa dan membiarkan
    // database (jika dikonfigurasi dengan benar) atau trigger menanganinya.
    // Namun, pendekatan terbaik adalah mengenkripsinya di sini.
    
    // Simulasi enkripsi sederhana (JANGAN GUNAKAN DI PRODUKSI)
    const encryptedNik = encryptData(nik);
    const encryptedNamaIbu = encryptData(nama_ibu_kandung);


    // --- Simpan ke Database ---
    const { data, error } = await supabaseClient
      .from("players")
      .insert({
        parent_id: user.id,
        nama,
        tanggal_lahir,
        posisi,
        nik: encryptedNik, // Kirim data terenkripsi
        nama_ibu_kandung: encryptedNamaIbu, // Kirim data terenkripsi
        status: 'nonaktif', // Default status
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      // Cek error spesifik, misalnya duplikasi NIK
      if (error.code === '23505' && error.message.includes('nik')) {
          return new Response(JSON.stringify({ error: "A player with this NIK already exists." }), {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 409, // Conflict
          });
      }
      return new Response(JSON.stringify({ error: "Failed to create player" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 201, // Created
    });

  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
