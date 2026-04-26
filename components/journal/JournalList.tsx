'use client';

import { useState } from 'react';
import { JournalPost } from '@/lib/types';
import JournalPostView from '@/components/journal/JournalPostView';

type Props = {
  posts: JournalPost[];
};

const CATEGORY_COLOURS: Record<string, string> = {
  design:     'bg-plum/10 text-plum',
  materials:  'bg-sand/20 text-plum/70',
  planting:   'bg-green-100 text-green-700',
  'build log':'bg-terra/10 text-terra',
};

export default function JournalList({ posts }: Props) {
  const [open, setOpen] = useState<string | null>(null);

  if (posts.length === 0) {
    return (
      <div className="border border-dashed border-sand/50 rounded-2xl p-16 text-center">
        <p className="font-body text-plum/40 text-lg italic">No posts yet — the journal is just getting started.</p>
      </div>
    );
  }

  const openPost = posts.find(p => p.id === open) ?? null;

  if (openPost) {
    return <JournalPostView post={openPost} onBack={() => setOpen(null)} />;
  }

  return (
    <div className="divide-y divide-sand/30">
      {posts.map(post => (
        <article
          key={post.id}
          className="group py-8 cursor-pointer"
          onClick={() => setOpen(post.id)}
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <span className={`font-heading text-xs uppercase tracking-widest px-2.5 py-1 rounded-full ${CATEGORY_COLOURS[post.category] ?? 'bg-stone-100 text-stone-600'}`}>
                  {post.category}
                </span>
                <span className="font-heading text-xs text-plum/40">
                  {new Date(post.published_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <h2 className="font-heading text-xl md:text-2xl text-plum group-hover:text-terra transition-colors mb-2 leading-snug">
                {post.title}
              </h2>
              <p className="font-body text-plum/60 text-sm leading-relaxed line-clamp-2">
                {post.content_md?.slice(0, 160)}…
              </p>
            </div>
            <span className="font-heading text-sm text-terra opacity-0 group-hover:opacity-100 transition-opacity shrink-0 pt-1">
              Read →
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}
