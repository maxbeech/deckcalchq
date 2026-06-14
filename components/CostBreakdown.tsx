// Itemized cost + materials panel, rendered from lib/cost.ts.
import { DECKING_LABEL, type CostResult, type Decking } from "@/lib/cost";

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export default function CostBreakdown({
  cost, decking, onDecking,
}: {
  cost: CostResult; decking: Decking; onDecking: (d: Decking) => void;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-stone-700">Estimated cost &amp; materials</div>
        <select aria-label="Decking material" value={decking}
          onChange={(e) => onDecking(e.target.value as Decking)}
          className="rounded-lg border border-stone-300 bg-white px-2 py-1 text-xs text-stone-900 focus:border-amber-500 focus:outline-none">
          {(Object.keys(DECKING_LABEL) as Decking[]).map((d) => (
            <option key={d} value={d}>{DECKING_LABEL[d]}</option>
          ))}
        </select>
      </div>
      <table className="mt-3 w-full text-sm">
        <tbody>
          {cost.items.map((it) => (
            <tr key={it.label} className="border-t border-stone-100">
              <td className="py-1.5 text-stone-600">{it.label}<span className="block text-xs text-stone-500">{it.detail}</span></td>
              <td className="py-1.5 text-right tabular-nums text-stone-500">{money(it.low)}–{money(it.high)}</td>
            </tr>
          ))}
          <tr className="border-t-2 border-stone-200">
            <td className="py-2 font-semibold text-stone-900">Total estimate</td>
            <td className="py-2 text-right font-bold tabular-nums text-stone-900">{money(cost.totalLow)}–{money(cost.totalHigh)}</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-stone-500">
        <div>≈ ${cost.perSqftLow}–${cost.perSqftHigh}/sq ft</div>
        <div className="text-right">≈ {cost.boards16ft} × 16′ boards · {cost.deckScrews.toLocaleString()} screws</div>
      </div>
      <p className="mt-2 text-xs text-stone-500">
        Low = DIY material budget; high = contractor-installed (labor included). Regional prices vary —
        treat as a planning range, not a quote.
      </p>
    </div>
  );
}
