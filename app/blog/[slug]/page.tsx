import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, POSTS } from "@/lib/posts";
import { SITE } from "@/lib/site";

export const revalidate = 604800; // 1 week — static blog content

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `${SITE.url}/blog/${p.slug}` },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    dateModified: p.date,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: `${SITE.url}/blog/${p.slug}`,
  };

  return (
    <article className="mx-auto max-w-2xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-4 text-sm text-stone-400">
        <Link href="/" className="hover:text-stone-700">Home</Link> ›{" "}
        <Link href="/blog" className="hover:text-stone-700">Guides</Link>
      </nav>
      <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">{p.title}</h1>
      <div className="mt-2 text-sm text-stone-400">{p.readMins} min read</div>
      <div className="mt-6 space-y-4">
        {p.body.map((b, i) => {
          if (b.type === "h2") return <h2 key={i} className="mt-6 text-xl font-bold text-stone-900">{b.text}</h2>;
          if (b.type === "ul") return (
            <ul key={i} className="list-disc space-y-1 pl-5 text-stone-700">
              {b.items.map((it) => <li key={it}>{it}</li>)}
            </ul>
          );
          return <p key={i} className="leading-relaxed text-stone-700">{b.text}</p>;
        })}
      </div>

      <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50 p-6">
        <h2 className="text-lg font-bold text-stone-900">Size your deck to code, free</h2>
        <p className="mt-2 text-sm text-stone-600">
          Get joist, beam, footing and stair sizes for your deck from the real IRC R507 tables — in seconds.
        </p>
        <Link href="/" className="mt-3 inline-block rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500">
          Open the deck calculator →
        </Link>
      </div>
    </article>
  );
}
