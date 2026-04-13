import Link from 'next/link';

export default function DashboardNav() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-20 py-8">
      <div className="max-w-7xl px-16 flex items-center justify-between">
        <span className="font-heading text-base font-semibold tracking-widest uppercase text-plum/80">
          Fynbos Garden
        </span>
        <div className="flex gap-6 font-heading text-base font-medium text-plum/70">
          <Link href="/" className="hover:text-plum transition-colors">Home</Link>
          <Link href="/garden" className="hover:text-plum transition-colors">Map</Link>
          <Link href="/journal" className="hover:text-plum transition-colors">Journal</Link>
        </div>
      </div>
    </nav>
  );
}
