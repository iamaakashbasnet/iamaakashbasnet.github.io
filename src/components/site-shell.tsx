import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-background transition-colors duration-500" />
        <div className="absolute -top-32 left-1/2 h-112 w-2xl -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.78_0.03_160/0.22),transparent_70%)] blur-2xl transition-opacity duration-500" />
        <div className="absolute right-[-10%] bottom-[-10%] h-88 w-88 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.82_0.02_80/0.18),transparent_70%)] blur-3xl transition-opacity duration-500" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.55%22/></svg>')]" />
      </div>
      <Nav />
      <main className="relative z-10 mx-auto w-full max-w-2xl flex-1 px-6 pt-16 sm:pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
