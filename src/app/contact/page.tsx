import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Stagger, StaggerItem } from '@/components/motion';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Aakash Basnet.',
};

export default function ContactPage() {
  return (
    <div className="pb-8">
      <Stagger>
        <StaggerItem>
          <h1 className="font-heading text-4xl tracking-[-0.03em] sm:text-5xl">
            Contact
          </h1>
        </StaggerItem>

        <StaggerItem>
          <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-muted-foreground">
            Have something in mind: a project, a collaboration, or just a hello?
            Drop me a line. I read everything.
          </p>
        </StaggerItem>

        <StaggerItem>
          <div className="mt-10">
            <p className="mb-3 text-[0.7rem] tracking-[0.18em] text-muted-foreground uppercase">
              Mail it here
            </p>
            <a
              href={`mailto:${site.email}`}
              className="group font-heading inline-flex items-center gap-2 text-[clamp(1.35rem,4vw,1.85rem)] tracking-[-0.02em] text-foreground transition-opacity hover:opacity-70"
            >
              {site.email}
              <ArrowUpRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </StaggerItem>

        <StaggerItem>
          <a
            href={`mailto:${site.email}`}
            className={cn(buttonVariants({ size: 'lg' }), 'mt-10')}
          >
            Write an email
          </a>
        </StaggerItem>
      </Stagger>
    </div>
  );
}
