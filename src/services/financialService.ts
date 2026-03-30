import { supabase } from "@/lib/supabase";

/**
 * Financial Service
 * 
 * Menangani logika bisnis keuangan seperti generate invoice, 
 * verifikasi pembayaran, dan kalkulasi laporan.
 */

export const generateBatchInvoices = async (periode: string, ssbId: string) => {
  console.log(`[Financial Service] Generating invoices for ${periode} in SSB ${ssbId}`);
  
  // 1. Ambil semua pemain aktif di SSB
  const { data: players, error: playerError } = await supabase
    .from("players")
    .select("id, nama, current_team_id")
    .eq("status", "active"); // Asumsi status aktif

  if (playerError) throw playerError;

  // 2. Loop & create invoices
  const invoices = players.map(player => ({
    invoice_number: `INV/${periode.replace('-', '')}/${player.id.slice(0, 4)}`,
    player_id: player.id,
    ssb_id: ssbId,
    periode: periode,
    total_nominal: 450000, // Nominal standar SPP
    status: 'unpaid',
    due_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15).toISOString()
  }));

  // In real implementation, batch insert into 'invoices'
  // return await supabase.from('invoices').insert(invoices);
  
  return { success: true, count: invoices.length };
};

export const verifyPayment = async (paymentId: string, treasurerId: string) => {
  // Logic:
  // 1. Update status di 'player_payments' menjadi verified = true
  // 2. Cari bill_id terkait
  // 3. Update status di 'invoices' / 'player_bills' menjadi 'paid'
  // 4. Catat audit log
  
  return { success: true };
};
