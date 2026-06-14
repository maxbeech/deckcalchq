"use client";

import { useMemo, useState } from "react";
import { BALUSTER_LABEL, computeRailing, DEFAULT_RAILING, type BalusterStyle, type RailingInputs } from "@/lib/railing";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-stone-700">{label}</span>
      {children}
      {hint && <span className="mt-0.5 block text-xs text-stone-500">{hint}</span>}
    </label>
  );
}
const ctl = "mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none";
const sel = (e: React.FocusEvent<HTMLInputElement>) => e.target.select();

export default function RailingCalculator() {
  const [inp, setInp] = useState<RailingInputs>(DEFAULT_RAILING);
  const r = useMemo(() => computeRailing(inp), [inp]);
  const set = <K extends keyof RailingInputs>(k: K, v: RailingInputs[K]) => setInp((p) => ({ ...p, [k]: v }));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <Field label="Total railing length (ft)" hint="Open perimeter that needs a guard">
          <input type="number" min={1} max={300} className={ctl} value={inp.railLengthFt} onFocus={sel}
            onChange={(e) => set("railLengthFt", Math.max(0, +e.target.value || 0))} />
        </Field>
        <Field label="Post spacing (ft)" hint="Center-to-center between rail posts">
          <input type="number" min={2} max={8} step={0.5} className={ctl} value={inp.postSpacingFt} onFocus={sel}
            onChange={(e) => set("postSpacingFt", Math.max(0, +e.target.value || 0))} />
        </Field>
        <Field label="Baluster style">
          <select className={ctl} value={inp.style} onChange={(e) => set("style", e.target.value as BalusterStyle)}>
            {(Object.keys(BALUSTER_LABEL) as BalusterStyle[]).map((s) => (
              <option key={s} value={s}>{BALUSTER_LABEL[s]}</option>
            ))}
          </select>
        </Field>
        <Field label="Target gap (in)" hint="IRC R312: a 4″ sphere must not pass — keep under 4″">
          <input type="number" min={2} max={3.9} step={0.25} className={ctl} value={inp.maxGapIn} onFocus={sel}
            onChange={(e) => set("maxGapIn", +e.target.value || 0)} />
        </Field>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="text-xs font-semibold tracking-wide text-stone-500 uppercase">Balusters</div>
            <div className="mt-1 text-3xl font-bold text-stone-900">{r.totalBalusters}</div>
            <div className="mt-1 text-sm text-stone-600">{r.balustersPerSection} per section</div>
          </div>
          <div className={`rounded-2xl border p-5 ${r.gapOk ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
            <div className="text-xs font-semibold tracking-wide text-stone-500 uppercase">Even gap</div>
            <div className="mt-1 text-3xl font-bold text-stone-900">{r.evenGapIn}″</div>
            <div className="mt-1 text-sm text-stone-600">{r.gapOk ? "passes (< 4″)" : "too wide — adjust"}</div>
          </div>
        </div>
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-1 text-sm font-semibold text-stone-700">Railing layout</div>
          <div className="flex justify-between border-t border-stone-100 py-2"><span className="text-sm text-stone-600">Rail sections</span><span className="font-semibold text-stone-900">{r.sections}</span></div>
          <div className="flex justify-between border-t border-stone-100 py-2"><span className="text-sm text-stone-600">Rail posts</span><span className="font-semibold text-stone-900">{r.totalPosts}</span></div>
          <div className="flex justify-between border-t border-stone-100 py-2"><span className="text-sm text-stone-600">Clear span per section</span><span className="font-semibold text-stone-900">{r.sectionClearIn}″</span></div>
          <div className="flex justify-between border-t border-stone-100 py-2"><span className="text-sm text-stone-600">Guard height (R312)</span><span className="font-semibold text-stone-900">{r.guardHeightIn}″ min</span></div>
          <p className="mt-3 text-xs text-stone-500">
            Even gap = (section clear − balusters × width) ÷ (balusters + 1). Code requires the gap to reject a
            4″ sphere (IRC R312.1.3); 3½″ is the safe build target. Guards are 36″ min on residential decks.
          </p>
        </div>
        {r.warnings.length > 0 && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <ul className="list-disc space-y-1 pl-5">{r.warnings.map((w) => <li key={w}>{w}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}
