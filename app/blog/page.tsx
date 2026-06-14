import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/lib/posts";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Deck Building Guides",
  description: "Practical, code-grounded guides to building a deck — joist and beam spans, footings, stairs, permits and cost.",
  alternates: { canonical: `${SITE.url}/blog` },
};

export default function BlogIndex() {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">Deck building guides</h1>
      <p className="mt-2 max-w-2xl text-stone-600">
        Clear, code-grounded answers to the questions that come up when you plan and build a deck.
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {POSTS.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`}
            className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow">
            <div className="font-semibold text-stone-900">{p.title}</div>
            <div className="mt-1 text-sm text-stone-500">{p.description}</div>
            <div className="mt-2 text-xs text-stone-400">{p.readMins} min read</div>
          </Link>
        ))}
      </div>
    </>
  );
}
