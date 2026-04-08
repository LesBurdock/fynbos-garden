import Link from 'next/link';
import Image from 'next/image';

export default function DashboardNav() {
  return (
    <nav className="w-full py-5">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
      <Link href="/">
        <Image src="/logo.png" alt="Fynbos Garden" width={48} height={48} className="object-contain" />
      </Link>
      <div className="flex items-center gap-8">
        <NavLink href="/garden">Roof layout</NavLink>
        <NavLink href="/journal">Journal</NavLink>
        <NavLink href="/admin/plants">Plant selection</NavLink>
      </div>
      </div>
    </nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-heading text-sm text-stone-600 hover:text-plum transition-colors">
      {children}
    </Link>
  );
}
