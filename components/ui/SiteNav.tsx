'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SiteNav({ variant = 'dark' }: { variant?: 'light' | 'dark' }) {
  const [open, setOpen] = useState(false);
  const logo = variant === 'light' ? 'text-white/80 hover:text-white' : 'text-terra hover:text-terra/70';
  const links = variant === 'light' ? 'text-white/70 hover:text-white' : 'text-terra/80 hover:text-terra';

  return (
    <nav className="absolute top-0 left-0 right-0 z-30">
      <div className="max-w-6xl mx-auto px-8 flex items-center justify-between py-6 md:py-8">
        <Link
          href="/"
          className={`font-heading text-sm md:text-base font-semibold tracking-widest uppercase transition-colors ${logo}`}
        >
          Fynbos Garden
        </Link>

        {/* Desktop links */}
        <div className={`hidden md:flex gap-6 font-heading text-base font-medium`}>
          <Link href="/garden" className={`transition-colors ${links}`}>Map</Link>
          <Link href="/dashboard" className={`transition-colors ${links}`}>Dashboard</Link>
          <Link href="/journal" className={`transition-colors ${links}`}>Journal</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          <svg
            width="22" height="22" viewBox="0 0 24 24" fill="none"
            className={variant === 'light' ? 'text-white' : 'text-terra'}
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-mist border-t border-sand/20 px-6 py-5 flex flex-col gap-5">
          {['/', '/garden', '/dashboard', '/journal'].map((href, i) => (
            <Link
              key={href}
              href={href}
              className={`font-heading text-base font-medium transition-colors ${links}`}
              onClick={() => setOpen(false)}
            >
              {['Home', 'Map', 'Dashboard', 'Journal'][i]}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
