'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { FadeIn, Stagger, StaggerItem } from '@/components/motion';
import { mergeBlogEntries, type BlogEntry } from '@/lib/blog';
import { getMediumPosts, type MediumPost } from '@/lib/medium';
import type { PostMeta } from '@/lib/posts';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function PostLink({
  entry,
  className,
  children,
}: {
  entry: BlogEntry;
  className?: string;
  children: React.ReactNode;
}) {
  if (entry.source === 'medium') {
    return (
      <a
        href={entry.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={entry.href} className={className}>
      {children}
    </Link>
  );
}

export function BlogFeed({
  local,
  initialMedium,
}: {
  local: PostMeta[];
  initialMedium: MediumPost[];
}) {
  const [medium, setMedium] = useState(initialMedium);

  useEffect(() => {
    let cancelled = false;

    getMediumPosts().then((posts) => {
      if (!cancelled && posts.length > 0) setMedium(posts);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const entries = useMemo(
    () => mergeBlogEntries(local, medium),
    [local, medium],
  );

  return (
    <>
      {entries.length === 0 ? (
        <FadeIn delay={0.15} className="mt-14">
          <p className="text-muted-foreground">No posts yet.</p>
        </FadeIn>
      ) : (
        <Stagger delay={0.12} className="mt-14 space-y-0">
          {entries.map((entry, index) => (
            <StaggerItem key={entry.id}>
              <PostLink
                entry={entry}
                className={cn(
                  'group block py-6 transition-opacity hover:opacity-80',
                  index > 0 && 'border-t border-border/70',
                  index === 0 && 'pt-0',
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                  <h2 className="text-[1.1rem] font-medium tracking-[-0.01em] text-foreground">
                    {entry.title}
                    {entry.source === 'medium' && (
                      <ArrowUpRight className="ml-1 inline size-3.5 -translate-y-px text-muted-foreground" />
                    )}
                  </h2>
                  <time
                    dateTime={entry.date}
                    className="text-sm text-muted-foreground"
                  >
                    {formatDate(entry.date)}
                  </time>
                </div>
                <p className="mt-2 max-w-lg text-[0.95rem] leading-relaxed text-muted-foreground">
                  {entry.description}
                </p>
                <p className="mt-3 text-xs tracking-[0.06em] text-muted-foreground/80 uppercase">
                  {entry.source === 'medium' && (
                    <>
                      Medium
                      <span aria-hidden> · </span>
                    </>
                  )}
                  {entry.readingTime}
                </p>
              </PostLink>
            </StaggerItem>
          ))}
        </Stagger>
      )}

      <FadeIn delay={0.2} className="mt-12">
        <a
          href={site.links.medium}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          All writing on Medium
          <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </FadeIn>
    </>
  );
}
