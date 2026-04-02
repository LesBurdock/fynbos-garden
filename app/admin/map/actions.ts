'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { HealthStatus } from '@/lib/types';

export type PositionFormData = {
  zone_id: string;
  plant_id: string;
  svg_xy: { x: number; y: number };
  health_status: HealthStatus;
  planted_at: string;
  notes: string;
};

export async function createPosition(data: PositionFormData) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('plant_positions').insert({
    ...data,
    removed_at: null,
    removal_reason: '',
  });
  if (error) return { error: error.message };
  revalidatePath('/admin/map');
  return { error: null };
}

export async function updatePosition(id: string, data: Omit<PositionFormData, 'svg_xy'>) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('plant_positions').update(data).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/map');
  return { error: null };
}

export async function removePosition(id: string) {
  const supabase = await createServerSupabaseClient();
  const today = new Date().toISOString().split('T')[0];
  const { error } = await supabase
    .from('plant_positions')
    .update({ removed_at: today })
    .eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/map');
  return { error: null };
}
