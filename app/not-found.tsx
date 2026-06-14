import Link from "next/link";
import { CALCS } from "@/lib/calculators";

export default function NotFound() {
  return (
    <div className="py-12 text-center">
      <h1 className="text-3xl font-bold text-stone-900">Page not found</h1>
      <p className="mx-auto mt-2 max-w-md text-stone-600">
        That page doesn&apos;t exist. Try one of our deck calculators instead:
      </p>
      <div className="mx-auto mt-6 flex max-w-lg flex-wrap justify-center gap-2">
        {CALCS.map((c) => (
          <Link key={c.slug} href={`/calculators/${c.slug}`}
            className="rounded-full border border-stone-200 bg-white px-3 py-1 text-sm text-stone-600 hover:border-amber-300">
            {c.name}
          </Link>
        ))}
        <Link href="/" className="rounded-full bg-amber-700 px-3 py-1 text-sm font-medium text-white hover:bg-amber-600">
          Home
        </Link>
      </div>
    </div>
  );
}
