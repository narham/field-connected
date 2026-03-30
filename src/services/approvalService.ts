import { supabase } from "@/lib/supabase";

/**
 * Approval Service
 * 
 * Menangani alur persetujuan strategis oleh Owner klub.
 */

type ApprovalType = 'PLAYER_TRANSFER' | 'CONTRACT' | 'BUDGET' | 'TOURNAMENT';

export const requestApproval = async (
  clubId: string, 
  requesterId: string, 
  type: ApprovalType, 
  entityId: string, 
  notes?: string
) => {
  const { data, error } = await supabase
    .from('club_approvals')
    .insert({
      club_id: clubId,
      requester_id: requesterId,
      entity_type: type,
      entity_id: entityId,
      notes,
      status: 'PENDING'
    })
    .select()
    .single();

  if (error) throw error;
  
  return data;
};

export const processApproval = async (
  approvalId: string, 
  approverId: string, 
  status: 'APPROVED' | 'REJECTED', 
  notes?: string
) => {
  const { data, error } = await supabase
    .from('club_approvals')
    .update({
      status,
      approver_id: approverId,
      notes,
      updated_at: new Date().toISOString()
    })
    .eq('id', approvalId)
    .select()
    .single();

  if (error) throw error;

  // Catat audit trail khusus Owner
  await supabase.from('financial_audit_logs').insert({
    ssb_id: data.club_id,
    action: `OWNER_${status}_${data.entity_type}`,
    table_name: 'club_approvals',
    record_id: approvalId,
    new_data: { status, approver_id: approverId }
  });

  return data;
};
