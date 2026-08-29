import readingTime from 'reading-time';
import { site } from '@/lib/site';

const MEDIUM_FEED = `https://medium.com/feed/@${site.mediumUsername}`;
const RSS2JSON_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(MEDIUM_FEED)}`;

export type MediumPost = {
  id: string;
  title: string;
  description: string;
  date: string;
  url: string;
  readingTime: string;
};

type Rss2JsonItem = {
  title?: string;
  pubDate?: string;
  link?: string;
  guid?: string;
  description?: string;
  content?: string;
};

type Rss2JsonResponse = {
  status?: string;
  items?: Rss2JsonItem[];
};

export async function getMediumPosts(): Promise<MediumPost[]> {
  const isBrowser = typeof window !== 'undefined';

  try {
    const posts = await fetchFromRss2Json(isBrowser);
    if (posts.length > 0) return posts;
  } catch {
    // Fall through to the official Medium RSS feed (works in Node / at build).
  }

  if (!isBrowser) {
    try {
      return await fetchFromMediumRss();
    } catch {
      return [];
    }
  }

  return [];
}

async function fetchFromRss2Json(fresh: boolean): Promise<MediumPost[]> {
  const res = await fetch(RSS2JSON_URL, {
    headers: { Accept: 'application/json' },
    cache: fresh ? 'no-store' : 'force-cache',
  });
  if (!res.ok) return [];

  const data = (await res.json()) as Rss2JsonResponse;
  if (data.status !== 'ok' || !data.items?.length) return [];

  return data.items
    .map((item) => toMediumPost(item))
    .filter((post): post is MediumPost => post !== null);
}

async function fetchFromMediumRss(): Promise<MediumPost[]> {
  const res = await fetch(MEDIUM_FEED, {
    headers: { Accept: 'application/rss+xml, application/xml, text/xml' },
  });
  if (!res.ok) return [];
  return parseMediumRss(await res.text());
}

function toMediumPost(item: Rss2JsonItem): MediumPost | null {
  const title = item.title?.trim();
  const url = cleanUrl(item.link);
  if (!title || !url) return null;

  const html = item.content || item.description || '';

  return {
    id: item.guid || url,
    title,
    description: excerptFromHtml(html),
    date: toIsoDate(item.pubDate),
    url,
    readingTime: readingTime(stripHtml(html)).text,
  };
}

function parseMediumRss(xml: string): MediumPost[] {
  return xml
    .split(/<item>/)
    .slice(1)
    .map((block) =>
      toMediumPost({
        title: rssTag(block, 'title'),
        link: rssTag(block, 'link'),
        guid: rssTag(block, 'guid'),
        pubDate: rssTag(block, 'pubDate'),
        content: rssTag(block, 'content:encoded') || rssTag(block, 'description'),
      }),
    )
    .filter((post): post is MediumPost => post !== null);
}

function rssTag(block: string, name: string): string {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const cdata = block.match(
    new RegExp(`<${escaped}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${escaped}>`),
  );
  if (cdata?.[1]) return cdata[1].trim();

  const plain = block.match(new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)</${escaped}>`));
  return plain?.[1]?.trim() ?? '';
}

function cleanUrl(url?: string): string {
  if (!url) return '';
  try {
    const parsed = new URL(url);
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return url;
  }
}

function toIsoDate(value?: string): string {
  if (!value) return new Date(0).toISOString();
  const parsed = new Date(value.includes('T') ? value : value.replace(' ', 'T') + 'Z');
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function excerptFromHtml(html: string, max = 170): string {
  const text = stripHtml(html);
  if (text.length <= max) return text;

  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
