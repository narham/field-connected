import { toast } from "sonner";

/**
 * Notification Service
 * 
 * Simulates sending notifications via WhatsApp and Email.
 * In production, this would call external APIs or Supabase Edge Functions.
 */

type NotificationEvent = 'new_bill' | 'payment_verified' | 'schedule_change' | 'low_attendance';

interface NotificationPayload {
  nama_anak: string;
  jumlah?: string;
  tanggal?: string;
  lokasi?: string;
}

const templates = {
  id: {
    new_bill: "Halo Orang Tua dari {{nama_anak}}, ada tagihan baru sebesar {{jumlah}} yang jatuh tempo pada {{tanggal}}. Silakan cek dashboard Anda.",
    payment_verified: "Pembayaran untuk {{nama_anak}} sebesar {{jumlah}} telah diverifikasi. Terima kasih!",
    schedule_change: "Jadwal latihan {{nama_anak}} berubah menjadi {{tanggal}} di {{lokasi}}.",
    low_attendance: "Perhatian: Tingkat kehadiran {{nama_anak}} saat ini di bawah 80%. Pastikan anak Anda tetap rutin berlatih."
  },
  en: {
    new_bill: "Hello Parent of {{nama_anak}}, there is a new bill of {{amount}} due on {{date}}. Please check your dashboard.",
    payment_verified: "Payment for {{nama_anak}} of {{amount}} has been verified. Thank you!",
    schedule_change: "Training schedule for {{nama_anak}} has changed to {{date}} at {{location}}.",
    low_attendance: "Attention: {{nama_anak}}'s attendance rate is currently below 80%. Please ensure regular training."
  }
};

export const sendNotification = async (
  event: NotificationEvent, 
  payload: NotificationPayload, 
  lang: 'id' | 'en' = 'id'
) => {
  let message = templates[lang][event];
  
  // Variable substitution
  message = message.replace('{{nama_anak}}', payload.nama_anak);
  if (payload.jumlah) message = message.replace('{{jumlah}}', payload.jumlah).replace('{{amount}}', payload.jumlah);
  if (payload.tanggal) message = message.replace('{{tanggal}}', payload.tanggal).replace('{{date}}', payload.tanggal);
  if (payload.lokasi) message = message.replace('{{lokasi}}', payload.lokasi).replace('{{location}}', payload.lokasi);

  console.log(`[Notification Service] Sending via WhatsApp & Email (${lang}):`, message);
  
  // Show a toast to simulate notification received by parent
  toast.info(`Notifikasi ${lang === 'id' ? 'Terkirim' : 'Sent'}`, {
    description: message,
    duration: 5000,
  });

  return { success: true, message };
};
