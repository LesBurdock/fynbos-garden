import { createServerSupabaseClient } from '@/lib/supabase-server';
import { JournalPost } from '@/lib/types';
import JournalAdmin from '@/components/admin/JournalAdmin';

export default async function AdminJournalPage() {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('journal_posts')
    .select('*')
    .order('published_at', { ascending: false });

  const posts = (data ?? []) as JournalPost[];

  return (
    <div className="h-screen flex flex-col bg-white">
      <JournalAdmin posts={posts} />
    </div>
  );
}
