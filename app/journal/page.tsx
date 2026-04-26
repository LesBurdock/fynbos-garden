import { createServerSupabaseClient } from '@/lib/supabase-server';
import { JournalPost } from '@/lib/types';
import SiteNav from '@/components/ui/SiteNav';
import JournalList from '@/components/journal/JournalList';

export default async function JournalPage() {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('journal_posts')
    .select('*')
    .order('published_at', { ascending: false });

  const posts = (data ?? []) as JournalPost[];

  return (
    <div className="min-h-screen bg-mist text-plum">
      <SiteNav variant="dark" solidBg />

      <div className="max-w-4xl mx-auto px-8 pt-32 pb-24">

        <div className="mb-16">
          <p className="font-heading text-xs uppercase tracking-widest text-terra mb-3">Writing</p>
          <h1 className="font-heading text-4xl md:text-5xl text-plum mb-4">Journal</h1>
          <p className="font-body text-lg text-plum/60 italic">
            Notes on growing fynbos above the city — design decisions, failures, and what&apos;s working.
          </p>
        </div>

        <JournalList posts={posts} />

      </div>
    </div>
  );
}
