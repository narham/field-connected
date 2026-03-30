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
  const invoiceData = players.map(player => ({
    invoice_number: `INV/${periode.replace('-', '')}/${player.id.slice(0, 4)}`,
    player_id: player.id,
    ssb_id: ssbId,
    periode: periode,
    total_nominal: 450000, // Nominal standar SPP
    status: 'unpaid',
    due_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15).toISOString()
  }));

  // 3. Batch insert into 'invoices'
  const { data, error: insertError } = await supabase
    .from('invoices')
    .insert(invoiceData)
    .select();

  if (insertError) throw insertError;

  // 4. Catat audit log
  await supabase.from('financial_audit_logs').insert({
    ssb_id: ssbId,
    action: 'CREATE_BATCH_INVOICES',
    table_name: 'invoices',
    new_data: { count: invoiceData.length, periode }
  });
  
  return { success: true, count: invoiceData.length, data };
};

export const verifyPayment = async (paymentId: string, treasurerId: string) => {
  // Logic:
  // 1. Ambil data pembayaran
  const { data: payment, error: fetchError } = await supabase
    .from('player_payments')
    .select('*, player_bills(*)')
    .eq('id', paymentId)
    .single();

  if (fetchError || !payment) throw new Error("Data pembayaran tidak ditemukan");

  // 2. Update status di 'player_payments' menjadi verified = true
  const { error: verifyError } = await supabase
    .from('player_payments')
    .update({ verified: true, verified_at: new Date().toISOString() })
    .eq('id', paymentId);

  if (verifyError) throw verifyError;

  // 3. Update status di 'invoices' / 'player_bills' menjadi 'paid'
  const { error: billError } = await supabase
    .from('player_bills')
    .update({ status: 'paid' })
    .eq('id', payment.bill_id);

  if (billError) throw billError;

  // 4. Catat audit log
  await supabase.from('financial_audit_logs').insert({
    treasurer_id: treasurerId,
    action: 'VERIFY_PAYMENT',
    table_name: 'player_payments',
    record_id: paymentId,
    new_data: { verified: true, bill_id: payment.bill_id }
  });
  
  return { success: true };
};
