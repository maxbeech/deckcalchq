import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeckCalculator from "@/components/DeckCalculator";
import { CALCS, getCalc } from "@/lib/calculators";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return CALCS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCalc(slug);
  if (!c) return {};
  return {
    title: c.h1,
    description: c.meta,
    alternates: { canonical: `${SITE.url}/calculators/${c.slug}` },
  };
}

export default async function CalcPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCalc(slug);
  if (!c) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${c.name} Calculator — ${SITE.name}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: `${SITE.url}/calculators/${c.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-4 text-sm text-stone-400">
        <Link href="/" className="hover:text-stone-700">Home</Link> ›{" "}
        <Link href="/calculators" className="hover:text-stone-700">Calculators</Link> › {c.name}
      </nav>
      <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">{c.h1}</h1>
      <p className="mt-2 max-w-2xl text-stone-600">{c.intro}</p>
      <div className="mt-6"><DeckCalculator /></div>

      <section className="mt-10 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-bold text-stone-900">{c.name} — what to know</h2>
        <ul className="mt-3 space-y-2 text-sm text-stone-600">
          {c.notes.map((n) => (
            <li key={n} className="flex gap-2"><span className="text-amber-500">•</span><span>{n}</span></li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-lg font-bold text-stone-900">Want a permit-ready deck plan?</h2>
        <p className="mt-2 text-sm text-stone-600">
          This estimate is built for planning. For your permit packet, DeckCalc HQ Pro turns these numbers into a
          stamped framing plan, footing schedule and material list as a printable PDF.
        </p>
        <Link href="/pricing" className="mt-3 inline-block rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">
          See Pro →
        </Link>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-base font-semibold text-stone-700">Other calculators</h2>
        <div className="flex flex-wrap gap-2">
          {CALCS.filter((x) => x.slug !== c.slug).map((x) => (
            <Link key={x.slug} href={`/calculators/${x.slug}`}
              className="rounded-full border border-stone-200 bg-white px-3 py-1 text-sm text-stone-600 hover:border-amber-300">
              {x.name}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
