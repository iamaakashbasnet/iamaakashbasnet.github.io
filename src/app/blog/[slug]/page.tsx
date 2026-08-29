import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FadeIn } from '@/components/motion';
import { getAllPostSlugs, getPostBySlug } from '@/lib/posts';

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  // output: export cannot emit a dynamic route with zero paths
  return (slugs.length > 0 ? slugs : ['_']).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Post' };
  return {
    title: post.title,
    description: post.description,
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="pb-8">
      <FadeIn>
        <Link
          href="/blog/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Blog
        </Link>
        <h1 className="font-heading mt-8 text-[clamp(2rem,5vw,3rem)] leading-[1.15] tracking-[-0.03em]">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime}</span>
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <div
          className="prose-blog mt-12"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </FadeIn>
    </article>
  );
}
