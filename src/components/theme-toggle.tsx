'use client';

import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

const PARTICLE_COUNT = 12;
const REVEAL_MS = 560;

type Particle = {
  id: string;
  x: number;
  y: number;
  size: number;
  delay: number;
};

function particlesForBurst(key: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + key * 0.35;
    const distance = 22 + (i % 3) * 8;
    return {
      id: `${key}-${i}`,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: i % 3 === 0 ? 3.5 : 2.25,
      delay: (i % 4) * 0.015,
    };
  });
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

async function revealThemeFromPoint(
  x: number,
  y: number,
  applyTheme: () => void,
) {
  if (!document.startViewTransition || prefersReducedMotion()) {
    applyTheme();
    return;
  }

  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  const transition = document.startViewTransition(() => {
    flushSync(applyTheme);
  });

  await transition.ready;

  // New theme expands from the icon across the whole page
  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ],
    },
    {
      duration: REVEAL_MS,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'both',
      pseudoElement: '::view-transition-new(root)',
    },
  );

  await transition.finished.catch(() => undefined);
}

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (particles.length === 0) return;
    const timer = window.setTimeout(() => setParticles([]), 650);
    return () => window.clearTimeout(timer);
  }, [particles]);

  const isDark = resolvedTheme === 'dark';

  async function toggle(event: React.MouseEvent<HTMLButtonElement>) {
    const nextKey = burstKey + 1;
    setBurstKey(nextKey);
    setParticles(particlesForBurst(nextKey));

    const nextTheme = isDark ? 'light' : 'dark';
    const { clientX: x, clientY: y } = event;

    await revealThemeFromPoint(x, y, () => {
      setTheme(nextTheme);
    });
  }

  if (!mounted) {
    return (
      <span
        className={cn('inline-flex size-8 shrink-0', className)}
        aria-hidden
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'relative inline-flex size-8 shrink-0 items-center justify-center overflow-visible rounded-md text-muted-foreground transition-colors hover:text-foreground',
        className,
      )}
    >
      <span className="relative z-10 flex size-4 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? 'moon' : 'sun'}
            initial={{ scale: 0.35, opacity: 0, rotate: -48 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.35, opacity: 0, rotate: 48 }}
            transition={{ type: 'spring', stiffness: 480, damping: 24 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {isDark ? (
              <Moon className="size-4" strokeWidth={1.75} />
            ) : (
              <Sun className="size-4" strokeWidth={1.75} />
            )}
          </motion.span>
        </AnimatePresence>
      </span>

      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 rounded-full bg-foreground"
            style={{
              width: p.size,
              height: p.size,
              marginLeft: -p.size / 2,
              marginTop: -p.size / 2,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: p.x,
              y: p.y,
              opacity: 0,
              scale: 0.1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.55,
              delay: p.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {burstKey > 0 && particles.length > 0 && (
          <motion.span
            key={`flash-${burstKey}`}
            className="pointer-events-none absolute inset-0 z-0 rounded-full bg-foreground/20"
            initial={{ scale: 0.35, opacity: 0.6 }}
            animate={{ scale: 2.6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>
    </button>
  );
}
