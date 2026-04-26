import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

const NAV_LINKS = [
  { href: '/admin/map',     label: 'Map' },
  { href: '/admin/plants',  label: 'Plants' },
  { href: '/admin/log',     label: 'Log' },
  { href: '/admin/tasks',   label: 'Tasks' },
  { href: '/admin/journal', label: 'Journal' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Login page renders its own full-page layout — just pass children through
  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="bg-plum border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-1">
            <span className="font-heading text-xs uppercase tracking-widest text-white/40 mr-4">Admin</span>
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-heading text-sm text-white/70 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
          <Link
            href="/"
            className="font-heading text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
}
