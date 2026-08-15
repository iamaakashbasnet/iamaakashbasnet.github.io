import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Stagger, StaggerItem } from '@/components/motion';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

export default function HomePage() {
  return (
    <div className="pb-8">
      <Stagger>
        <StaggerItem>
          <p className="mb-5 text-[0.75rem] tracking-[0.18em] text-muted-foreground uppercase">
            Software / Product Engineer · Kathmandu
          </p>
        </StaggerItem>

        <StaggerItem>
          <h1 className="font-heading text-[clamp(2.75rem,8vw,4.25rem)] leading-[1.05] tracking-[-0.03em] text-foreground">
            {site.name}
          </h1>
        </StaggerItem>

        <StaggerItem>
          <p className="mt-7 max-w-md text-[1.05rem] leading-relaxed text-muted-foreground">
            I build products end to end: software, systems, and strategy. I'm
            currently founding and leading{' '}
            <a
              href={site.links.covertview}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline decoration-foreground/20 underline-offset-4 transition-colors hover:decoration-foreground/50"
            >
              CovertView
            </a>
            , a modern market screening platform for traders.
          </p>
        </StaggerItem>

        <StaggerItem>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/blog/" className={cn(buttonVariants({ size: 'lg' }))}>
              Read blog
            </Link>
            <a
              href={site.links.resume}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
            >
              Resume
            </a>
          </div>
        </StaggerItem>
      </Stagger>
    </div>
  );
}
