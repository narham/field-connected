import { serve } from "std/http/server";
import { createClient } from "supabase";
import { corsHeaders } from "../_shared/cors.ts";

const MAX_RADIUS_METERS = 50;

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization")!;
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { session_id, records, location } = await req.json();

    // 1. Validasi Kepemilikan Sesi (Server-side check)
    const { data: session, error: sessionError } = await supabaseClient
      .from("training_sessions")
      .select("*, teams(name)")
      .eq("id", session_id)
      .single();

    if (sessionError || !session) throw new Error("Sesi latihan tidak ditemukan");

    // 2. Validasi Radius GPS (Jika lokasi dikirim)
    // Di skenario nyata, lokasi lapangan (lat/lng) disimpan di tabel teams atau training_sessions
    // Untuk demo, kita asumsikan lokasi lapangan adalah Point(0,0) atau skip jika tidak ada data lapangan
    if (location && session.location_gps) {
        const distance = calculateDistance(
            location.lat, location.lng, 
            session.location_gps.lat, session.location_gps.lng
        );
        if (distance > MAX_RADIUS_METERS) {
            return new Response(JSON.stringify({ 
                error: "Out of range", 
                message: `Anda berada ${Math.round(distance)}m dari lapangan. Batas maksimal ${MAX_RADIUS_METERS}m.` 
            }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 400,
            });
        }
    }

    // 3. Simpan Absensi
    const upsertData = records.map((r: any) => ({
      player_id: r.player_id,
      session_id: session_id,
      status: r.status,
      check_in_location_gps: location ? `(${location.lat},${location.lng})` : null,
      selfie_url: r.selfie_url || null,
      updated_at: new Date().toISOString()
    }));

    const { error: upsertError } = await supabaseClient
      .from("player_attendances")
      .upsert(upsertData, { onConflict: 'player_id,session_id' });

    if (upsertError) throw upsertError;

    // 4. Audit Log
    await supabaseClient.from("player_audit_logs").insert({
        user_id: user.id,
        action: "SUBMIT_ATTENDANCE",
        record_id: session_id,
        table_name: "player_attendances",
        new_values: { count: records.length }
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
