import type { Metadata } from "next";
import Link from "next/link";
import { CALCS } from "@/lib/calculators";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Deck Calculators",
  description: "Free deck calculators — joist span, beam span, footings, stairs and cost, all built to the IRC R507 deck code.",
  alternates: { canonical: `${SITE.url}/calculators` },
};

export default function CalculatorsIndex() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">Deck calculators</h1>
      <p className="mt-2 max-w-2xl text-stone-600">
        Each tool reads the real IRC R507 deck span tables. Start with whichever part of the deck you&apos;re
        sizing — they all run on the same code-compliant engine.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {CALCS.map((c) => (
          <Link key={c.slug} href={`/calculators/${c.slug}`}
            className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow">
            <div className="font-semibold text-stone-900">{c.h1}</div>
            <div className="mt-1 text-sm text-stone-500">{c.keyword} · {c.volume} searches</div>
            <p className="mt-2 text-sm text-stone-600">{c.meta}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
