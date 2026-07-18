'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { site } from '@/lib/site';

const links = [
  { href: '/', label: 'Home' },
  { href: '/blog/', label: 'Blog' },
  { href: '/contact/', label: 'Contact' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="relative z-20 mx-auto w-full max-w-2xl px-6 pt-10 sm:pt-14">
      <nav className="flex items-center justify-between gap-6">
        <Link
          href="/"
          className="font-heading text-[1.05rem] tracking-[-0.02em] text-foreground transition-opacity hover:opacity-70"
        >
          {site.name}
        </Link>
        <div className="flex items-center gap-4 sm:gap-5">
          <ul className="flex items-center gap-4 text-[0.8rem] tracking-[0.04em] text-muted-foreground uppercase sm:gap-5">
            {links.map((link) => {
              const active =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href.replace(/\/$/, ''));

              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={cn(
                      'transition-colors hover:text-foreground',
                      active && 'text-foreground',
                    )}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 h-px w-full bg-foreground/40"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
