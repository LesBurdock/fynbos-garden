'use client';

import { JournalPost } from '@/lib/types';

type Props = {
  post: JournalPost;
  onBack: () => void;
};

export default function JournalPostView({ post, onBack }: Props) {
  return (
    <div>
      <button
        onClick={onBack}
        className="font-heading text-sm text-terra hover:text-terra/70 transition-colors mb-10 flex items-center gap-1"
      >
        ← All posts
      </button>

      <div className="mb-6">
        <span className="font-heading text-xs uppercase tracking-widest text-terra">
          {post.category}
        </span>
        <span className="font-heading text-xs text-plum/40 ml-4">
          {new Date(post.published_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
      </div>

      <h1 className="font-heading text-3xl md:text-4xl text-plum mb-10 leading-snug">
        {post.title}
      </h1>

      <div className="font-body text-lg text-plum/80 leading-relaxed whitespace-pre-wrap">
        {post.content_md}
      </div>
    </div>
  );
}
