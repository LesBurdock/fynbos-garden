'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { HealthStatus } from '@/lib/types';

export async function createCareLog(data: {
  position_id: string;
  logged_at: string;
  action: string;
  health_status: HealthStatus;
  notes: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('care_log').insert(data);
  if (error) return { error: error.message };
  revalidatePath('/admin/log');
  return { error: null };
}

export async function createWateringLog(data: {
  zone_id: string;
  watered_at: string;
  amount_litres: number;
  notes: string;
}) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('watering_log').insert(data);
  if (error) return { error: error.message };
  revalidatePath('/admin/log');
  return { error: null };
}
