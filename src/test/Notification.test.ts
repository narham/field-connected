import { describe, it, expect, vi } from 'vitest';
import { sendNotification } from '../services/notificationService';

// Mock the toast from sonner
vi.mock('sonner', () => ({
  toast: {
    info: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
  }
}));

describe('NotificationService', () => {
  it('should substitute variables in Indonesian template correctly', async () => {
    const payload = {
      nama_anak: 'Budi',
      jumlah: 'Rp 100.000',
      tanggal: '2026-04-01'
    };
    
    const result = await sendNotification('new_bill', payload, 'id');
    
    expect(result.success).toBe(true);
    expect(result.message).toContain('Budi');
    expect(result.message).toContain('Rp 100.000');
    expect(result.message).toContain('2026-04-01');
    expect(result.message).toContain('Halo Orang Tua');
  });

  it('should substitute variables in English template correctly', async () => {
    const payload = {
      nama_anak: 'Budi',
      jumlah: 'Rp 100,000',
      tanggal: '2026-04-01'
    };
    
    const result = await sendNotification('new_bill', payload, 'en');
    
    expect(result.success).toBe(true);
    expect(result.message).toContain('Budi');
    expect(result.message).toContain('Rp 100,000');
    expect(result.message).toContain('2026-04-01');
    expect(result.message).toContain('Hello Parent');
  });

  it('should handle schedule change notification', async () => {
    const payload = {
      nama_anak: 'Budi',
      tanggal: 'Senin, 16:00',
      lokasi: 'Lapangan Senayan'
    };
    
    const result = await sendNotification('schedule_change', payload, 'id');
    
    expect(result.success).toBe(true);
    expect(result.message).toContain('Senin, 16:00');
    expect(result.message).toContain('Lapangan Senayan');
  });
});
