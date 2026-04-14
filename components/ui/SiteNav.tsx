'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="absolute top-0 left-0 right-0 z-30">
      <div className="max-w-7xl px-6 md:px-16 flex items-center justify-between py-6 md:py-8">
        <Link
          href="/"
          className="font-heading text-sm md:text-base font-semibold tracking-widest uppercase text-plum/80 hover:text-plum transition-colors"
        >
          Fynbos Garden
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-6 font-heading text-base font-medium text-plum/70">
          <Link href="/garden" className="hover:text-plum transition-colors">Map</Link>
          <Link href="/dashboard" className="hover:text-plum transition-colors">Dashboard</Link>
          <Link href="/journal" className="hover:text-plum transition-colors">Journal</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 -mr-2"
          onClick={() => setOpen(prev => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          <Image src="/hamburger-menu-svgrepo-com.svg" alt="Menu" width={22} height={22} />
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-mist border-t border-sand/20 px-6 py-5 flex flex-col gap-5">
          <Link
            href="/"
            className="font-heading text-base font-medium text-plum/70 hover:text-plum transition-colors"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/garden"
            className="font-heading text-base font-medium text-plum/70 hover:text-plum transition-colors"
            onClick={() => setOpen(false)}
          >
            Map
          </Link>
          <Link
            href="/dashboard"
            className="font-heading text-base font-medium text-plum/70 hover:text-plum transition-colors"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/journal"
            className="font-heading text-base font-medium text-plum/70 hover:text-plum transition-colors"
            onClick={() => setOpen(false)}
          >
            Journal
          </Link>
        </div>
      )}
    </nav>
  );
}
