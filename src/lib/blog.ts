import type { MediumPost } from '@/lib/medium';
import type { PostMeta } from '@/lib/posts';

export type BlogEntry = {
  id: string;
  title: string;
  description: string;
  date: string;
  href: string;
  source: 'local' | 'medium';
  readingTime: string;
};

export function mergeBlogEntries(
  local: PostMeta[],
  medium: MediumPost[],
): BlogEntry[] {
  const localEntries: BlogEntry[] = local.map((post) => ({
    id: `local:${post.slug}`,
    title: post.title,
    description: post.description,
    date: post.date,
    href: `/blog/${post.slug}/`,
    source: 'local',
    readingTime: post.readingTime,
  }));

  const mediumEntries: BlogEntry[] = medium.map((post) => ({
    id: `medium:${post.id}`,
    title: post.title,
    description: post.description,
    date: post.date,
    href: post.url,
    source: 'medium',
    readingTime: post.readingTime,
  }));

  return [...localEntries, ...mediumEntries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
