import type { Metadata } from "next";
import Link from "next/link";
import CheckoutButton from "@/components/CheckoutButton";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing — Permit-Ready Deck Plans",
  description: "The DeckCalc HQ calculator is free forever. Upgrade to a permit-ready deck plan PDF with stamped framing, footing schedule and material list.",
  alternates: { canonical: `${SITE.url}/pricing` },
};

const freeFeatures = [
  "Joist, beam, post & footing sizing (IRC R507)",
  "Stair layout & guard height to code",
  "Frost-depth footings for all 50 states",
  "Material list & build-cost estimate",
  "Unlimited calculations, no account",
];

const proFeatures = [
  "Everything in Free, plus:",
  "Permit-ready PDF: framing plan, footing schedule, material list",
  "Joist & beam layout diagram for your exact deck",
  "Code citations (IRC R507/R311) for your submittal",
  "Lifetime access to the plan, revisions included",
];

export default function Pricing() {
  return (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">Simple, honest pricing</h1>
        <p className="mx-auto mt-2 max-w-xl text-stone-600">
          The calculator is free forever. When you&apos;re ready to pull a permit, turn your numbers into a plan
          the inspector will accept.
        </p>
      </div>

      <div className="mx-auto mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-stone-500 uppercase">Free</div>
          <div className="mt-1 text-3xl font-bold text-stone-900">$0</div>
          <p className="mt-1 text-sm text-stone-500">The full deck code calculator</p>
          <ul className="mt-4 space-y-2 text-sm text-stone-600">
            {freeFeatures.map((f) => (
              <li key={f} className="flex gap-2"><span className="text-emerald-500">✓</span><span>{f}</span></li>
            ))}
          </ul>
          <Link href="/" className="mt-6 block rounded-lg border border-stone-300 px-4 py-2 text-center text-sm font-medium text-stone-700 hover:bg-stone-50">
            Use the calculator
          </Link>
        </div>

        <div className="rounded-2xl border-2 border-amber-300 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-amber-700 uppercase">Pro plan</div>
          <div className="mt-1 text-3xl font-bold text-stone-900">$29<span className="text-base font-medium text-stone-500"> one-time</span></div>
          <p className="mt-1 text-sm text-stone-500">Permit-ready deck plan PDF</p>
          <ul className="mt-4 space-y-2 text-sm text-stone-600">
            {proFeatures.map((f) => (
              <li key={f} className="flex gap-2"><span className="text-amber-500">✓</span><span>{f}</span></li>
            ))}
          </ul>
          <div className="mt-6"><CheckoutButton /></div>
        </div>
      </div>

      <section className="mx-auto mt-10 max-w-3xl rounded-2xl border border-stone-200 bg-stone-100 p-6 text-center text-sm text-stone-600">
        <h2 className="text-base font-semibold text-stone-800">Building pros &amp; deck companies</h2>
        <p className="mt-2">
          Run a deck-building business? We send qualified homeowner leads from this calculator to vetted
          contractors. Email <span className="font-medium text-stone-800">hello@deckcalchq.com</span> to join the network.
        </p>
      </section>
    </>
  );
}
