import type { Metadata } from 'next';
import { FadeIn } from '@/components/motion';
import { BlogFeed } from '@/components/blog-feed';
import { getMediumPosts } from '@/lib/medium';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes on software, product engineering, and markets.',
};

export default async function BlogPage() {
  const local = getAllPosts();
  const medium = await getMediumPosts();

  return (
    <div className="pb-8">
      <FadeIn>
        <h1 className="font-heading text-4xl tracking-[-0.03em] sm:text-5xl">
          Blog
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          Short notes here, and pieces I publish on Medium. Longer research
          stays on this site.
        </p>
      </FadeIn>

      <BlogFeed local={local} initialMedium={medium} />
    </div>
  );
}
