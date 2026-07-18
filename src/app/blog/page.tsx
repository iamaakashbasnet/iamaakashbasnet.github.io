import type { Metadata } from 'next';
import Link from 'next/link';
import { FadeIn, Stagger, StaggerItem } from '@/components/motion';
import { getAllPosts } from '@/lib/posts';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes on software, product engineering, and markets.',
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="pb-8">
      <FadeIn>
        <h1 className="font-heading text-4xl tracking-[-0.03em] sm:text-5xl">
          Blog
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Short notes on software, product, and markets.
        </p>
      </FadeIn>

      {posts.length === 0 ? (
        <FadeIn delay={0.15} className="mt-14">
          <p className="text-muted-foreground">No posts yet.</p>
        </FadeIn>
      ) : (
        <Stagger delay={0.12} className="mt-14 space-y-0">
          {posts.map((post, index) => (
            <StaggerItem key={post.slug}>
              <Link
                href={`/blog/${post.slug}/`}
                className={cn(
                  'group block py-6 transition-opacity hover:opacity-80',
                  index > 0 && 'border-t border-border/70',
                  index === 0 && 'pt-0',
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                  <h2 className="text-[1.1rem] font-medium tracking-[-0.01em] text-foreground">
                    {post.title}
                  </h2>
                  <time
                    dateTime={post.date}
                    className="text-sm text-muted-foreground"
                  >
                    {formatDate(post.date)}
                  </time>
                </div>
                <p className="mt-2 max-w-lg text-[0.95rem] leading-relaxed text-muted-foreground">
                  {post.description}
                </p>
                <p className="mt-3 text-xs tracking-[0.06em] text-muted-foreground/80 uppercase">
                  {post.readingTime}
                </p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}
