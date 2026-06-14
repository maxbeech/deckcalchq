import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import DeckCalculator from "@/components/DeckCalculator";
import { getState, US_STATES } from "@/lib/frost";
import { SITE } from "@/lib/site";

export const revalidate = 604800; // 1 week — static reference content

export function generateStaticParams() {
  return US_STATES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getState(slug);
  if (!s) return {};
  return {
    title: `${s.name} Deck Code, Permits & Footing Depth`,
    description: `Deck permit rules and the ${s.frost}" footing depth required below ${s.name}'s frost line, plus a free IRC R507 deck framing calculator preset to ${s.name}.`,
    alternates: { canonical: `${SITE.url}/states/${s.slug}` },
  };
}

export default async function StatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getState(slug);
  if (!s) notFound();

  return (
    <>
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "By state", href: "/states" }, { name: s.name }]} />
      <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
        {s.name} Deck Code &amp; Footing Depth
      </h1>
      <p className="mt-2 max-w-2xl text-stone-600">
        In {s.name}, deck footings must bear at least <strong>{s.frost}&quot; below grade</strong> to sit below the
        frost line and resist heave. The calculator below is preset to that depth — size your joists, beam, posts
        and stairs to the IRC R507 deck code, then adjust for your build.
      </p>
      <div className="mt-6"><DeckCalculator initialState={s.slug} /></div>

      <section className="mt-10 rounded-2xl border border-stone-200 bg-white p-6 text-sm leading-relaxed text-stone-600">
        <h2 className="text-lg font-bold text-stone-900">Building a deck in {s.name}</h2>
        <p className="mt-2">
          Most {s.name} jurisdictions adopt the International Residential Code, so the joist and beam span tables
          here apply statewide — but footing depth, snow load and local amendments are set by your city or county.
          The {s.frost}&quot; depth shown is typical for {s.name}; confirm the exact figure with your building
          department before you dig, as it varies with elevation and soil.
        </p>
        <p className="mt-2">
          You&apos;ll almost certainly need a permit for a deck attached to the house or more than about 30&quot;
          above grade, plus a footing inspection before concrete is poured. A
          {" "}<Link href="/pricing" className="text-amber-700 underline">DeckCalc HQ Pro</Link>{" "}
          plan packages these numbers into a permit-ready PDF for your {s.name} submittal.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-base font-semibold text-stone-700">Nearby states</h2>
        <div className="flex flex-wrap gap-2">
          {US_STATES.filter((x) => x.slug !== s.slug && Math.abs(x.frost - s.frost) <= 12).slice(0, 8).map((x) => (
            <Link key={x.slug} href={`/states/${x.slug}`}
              className="rounded-full border border-stone-200 bg-white px-3 py-1 text-sm text-stone-600 hover:border-amber-300">
              {x.name}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
