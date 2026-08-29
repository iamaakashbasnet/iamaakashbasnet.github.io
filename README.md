# aakashbasnet.com.np

Personal portfolio and blog. Next.js, shadcn/ui, Framer Motion.

The blog is hybrid: Markdown in `content/blog` for longer research, plus latest Medium posts pulled from the public RSS feed.

## Branches

| Branch | Purpose |
|--------|---------|
| `dev` | Source code (work here) |
| `main` | Built static site for GitHub Pages |

Pushing to `dev` runs Actions, builds the site, and publishes `out/` to `main`.

In the repo: **Settings → Pages → Deploy from a branch → `main` / root**.

## Develop

```bash
git checkout dev
npm install
npm run dev
```

## Build locally

```bash
npm run build
```

Static output lands in `out/`.

## New blog post

**On this site** — add a file under `content/blog/your-slug.md`:

```md
---
title: Your title
description: "Short summary"
date: 2026-07-18
---

Your content here.
```

**On Medium** — publish as usual. New stories show up on `/blog` from the RSS feed (via rss2json, with a direct Medium RSS fallback at build time). No redeploy needed for visitors with JavaScript.
