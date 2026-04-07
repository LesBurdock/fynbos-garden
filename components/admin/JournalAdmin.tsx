'use client';

import { useState } from 'react';
import { JournalPost } from '@/lib/types';
import { createPost, updatePost, deletePost } from '@/app/admin/journal/actions';

type Props = {
  posts: JournalPost[];
};

type Category = 'design' | 'materials' | 'planting' | 'build log';

const CATEGORIES: Category[] = ['design', 'materials', 'planting', 'build log'];

const CATEGORY_COLOURS: Record<Category, string> = {
  design: 'bg-purple-100 text-purple-700',
  materials: 'bg-amber-100 text-amber-700',
  planting: 'bg-green-100 text-green-700',
  'build log': 'bg-blue-100 text-blue-700',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function todayISO() {
  return new Date().toISOString().slice(0, 16); // datetime-local format
}

const EMPTY_FORM = {
  title: '',
  category: 'design' as Category,
  content_md: '',
  published_at: todayISO(),
};

export default function JournalAdmin({ posts }: Props) {
  const [selected, setSelected] = useState<JournalPost | null | 'new'>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const panelOpen = selected !== null;
  const isNew = selected === 'new';

  function openNew() {
    setForm({ ...EMPTY_FORM, published_at: todayISO() });
    setError(null);
    setConfirmDelete(false);
    setSelected('new');
  }

  function openEdit(post: JournalPost) {
    setForm({
      title: post.title,
      category: post.category as Category,
      content_md: post.content_md,
      published_at: post.published_at.slice(0, 16),
    });
    setError(null);
    setConfirmDelete(false);
    setSelected(post);
  }

  function close() {
    setSelected(null);
    setError(null);
    setConfirmDelete(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title: form.title,
      category: form.category,
      content_md: form.content_md,
      published_at: new Date(form.published_at).toISOString(),
    };

    const result = isNew
      ? await createPost(payload)
      : await updatePost((selected as JournalPost).id, payload);

    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      close();
    }
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    const result = await deletePost((selected as JournalPost).id);
    setDeleting(false);
    if (result.error) {
      setError(result.error);
    } else {
      close();
    }
  }

  return (
    <div className="flex h-full">
      {/* Post list */}
      <div className={`flex flex-col flex-1 min-w-0 transition-all ${panelOpen ? 'mr-[480px]' : ''}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
          <h1 className="text-lg font-semibold text-stone-800">Journal posts</h1>
          <button
            onClick={openNew}
            className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + New post
          </button>
        </div>

        <div className="overflow-auto flex-1">
          {posts.length === 0 ? (
            <p className="text-sm text-stone-400 text-center py-16">No posts yet — write the first one.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Published</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr
                    key={post.id}
                    onClick={() => openEdit(post)}
                    className={`border-b border-stone-100 cursor-pointer hover:bg-stone-50 transition-colors ${
                      !isNew && (selected as JournalPost)?.id === post.id ? 'bg-green-50' : ''
                    }`}
                  >
                    <td className="px-6 py-3 font-medium text-stone-800">{post.title}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLOURS[post.category as Category] ?? 'bg-stone-100 text-stone-600'}`}>
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-stone-500">{formatDate(post.published_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Side panel */}
      {panelOpen && (
        <div className="fixed top-0 right-0 w-[480px] h-full bg-white border-l border-stone-200 shadow-xl z-10 flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 shrink-0">
            <h2 className="text-base font-semibold text-stone-800">
              {isNew ? 'New post' : 'Edit post'}
            </h2>
            <button onClick={close} className="text-stone-400 hover:text-stone-600 text-xl leading-none">&times;</button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                  placeholder="e.g. Why I chose fynbos for a rooftop"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-600"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Publish date</label>
                  <input
                    type="datetime-local"
                    value={form.published_at}
                    onChange={e => setForm(f => ({ ...f, published_at: e.target.value }))}
                    required
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-green-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Content (Markdown)</label>
                <textarea
                  value={form.content_md}
                  onChange={e => setForm(f => ({ ...f, content_md: e.target.value }))}
                  required
                  rows={20}
                  placeholder={'# Post title\n\nWrite your post here in Markdown...'}
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm text-stone-800 font-mono placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>

            <div className="shrink-0 px-6 py-4 border-t border-stone-200 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-5 py-2 rounded-lg disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving…' : isNew ? 'Publish' : 'Save changes'}
              </button>

              {!isNew && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className={`text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                    confirmDelete
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                  }`}
                >
                  {deleting ? 'Deleting…' : confirmDelete ? 'Confirm delete' : 'Delete'}
                </button>
              )}

              {confirmDelete && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="text-sm text-stone-400 hover:text-stone-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
