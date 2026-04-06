'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function createTask(data: {
  title: string;
  zone_id: string | null;
  due_date: string;
  task_type: 'weeding' | 'mulching' | 'other';
}) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('garden_tasks').insert({ ...data, completed_at: null });
  if (error) return { error: error.message };
  revalidatePath('/admin/tasks');
  return { error: null };
}

export async function completeTask(id: string) {
  const supabase = await createServerSupabaseClient();
  const now = new Date().toISOString();
  const { error } = await supabase.from('garden_tasks').update({ completed_at: now }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/tasks');
  return { error: null };
}
