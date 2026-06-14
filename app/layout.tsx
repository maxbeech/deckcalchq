import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  openGraph: { title: SITE.name, description: SITE.description, url: SITE.url, siteName: SITE.name, type: "website" },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#d97706",
};

function Header() {
  return (
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-stone-900">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-700 text-sm text-white">D</span>
          DeckCalc<span className="text-amber-700">HQ</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-stone-600">
          <Link href="/calculators" className="hover:text-stone-900">Calculators</Link>
          <Link href="/states" className="hidden hover:text-stone-900 sm:inline">By state</Link>
          <Link href="/blog" className="hover:text-stone-900">Guides</Link>
          <Link href="/pricing" className="rounded-lg bg-stone-900 px-3 py-1.5 font-medium text-white hover:bg-stone-700">Pro</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-200 bg-stone-100">
      <div className="mx-auto max-w-5xl px-5 py-8 text-sm text-stone-600">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/" className="hover:text-stone-900">Deck calculator</Link>
          <Link href="/calculators/deck-joist-span-calculator" className="hover:text-stone-900">Joist span</Link>
          <Link href="/calculators/deck-beam-span-calculator" className="hover:text-stone-900">Beam span</Link>
          <Link href="/calculators/deck-footing-calculator" className="hover:text-stone-900">Footings</Link>
          <Link href="/calculators/deck-stair-calculator" className="hover:text-stone-900">Stairs</Link>
          <Link href="/blog" className="hover:text-stone-900">Guides</Link>
          <Link href="/methodology" className="hover:text-stone-900">Methodology</Link>
          <Link href="/pricing" className="hover:text-stone-900">Pro / permit plan</Link>
        </div>
        <p className="mt-4 max-w-2xl text-xs text-stone-600">
          {SITE.name} reads the IRC R507 / AWC DCA6 prescriptive deck span tables to size your
          framing. It is a planning aid — local amendments vary, so always confirm member sizes,
          footing depth and connections with your building department before you build. © {new Date().getFullYear()} {SITE.name}.
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">
        <Header />
        <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
