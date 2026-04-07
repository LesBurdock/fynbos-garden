'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function createPost(data: {
  title: string;
  category: string;
  content_md: string;
  published_at: string;
}) {
  const supabase = await createServerSupabaseClient();
  const slug = toSlug(data.title);
  const { error } = await supabase.from('journal_posts').insert({ ...data, slug });
  if (error) return { error: error.message };
  revalidatePath('/admin/journal');
  return { error: null };
}

export async function updatePost(
  id: string,
  data: {
    title: string;
    category: string;
    content_md: string;
    published_at: string;
  }
) {
  const supabase = await createServerSupabaseClient();
  const slug = toSlug(data.title);
  const { error } = await supabase.from('journal_posts').update({ ...data, slug }).eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/journal');
  return { error: null };
}

export async function deletePost(id: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('journal_posts').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/journal');
  return { error: null };
}
