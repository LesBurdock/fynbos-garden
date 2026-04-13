'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { Plant } from '@/lib/types';

export type PlantFormData = Omit<Plant, 'id' | 'reference_urls'> & {
  reference_urls: string[];
};

export async function createPlant(data: PlantFormData) {
  const supabase = await createServerSupabaseClient();
  const slug = data.slug || data.latin_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const { error } = await supabase.from('plants').insert({ ...data, slug });
  if (error) return { error: error.message };
  revalidatePath('/admin/plants');
  return { error: null };
}

export async function updatePlant(id: string, data: PlantFormData) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('plants').update(data).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/plants');
  return { error: null };
}

export async function deletePlant(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('plants').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/plants');
  return { error: null };
}
