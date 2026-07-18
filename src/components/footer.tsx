import { site } from '@/lib/site';

export function Footer() {
  return (
    <footer className="relative z-10 mx-auto mt-auto w-full max-w-2xl px-6 pt-20 pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-8 text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <div className="flex gap-5">
          <a
            href={site.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
          <a
            href={site.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            LinkedIn
          </a>
          <a
            href="/contact/"
            className="transition-colors hover:text-foreground"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
