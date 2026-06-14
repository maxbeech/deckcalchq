"use client";

import { useMemo, useState } from "react";
import { computeDeck, DEFAULT_DECK, type DeckInputs } from "@/lib/deck";
import { computeCost, DEFAULT_DECKING, type Decking } from "@/lib/cost";
import { BEAM_SIZES, JOIST_SIZES, SPECIES_LABEL, ftIn, type BeamSize, type JoistSize, type Spacing, type Species } from "@/lib/deck-tables";
import { US_STATES } from "@/lib/frost";
import FramingDiagram from "./FramingDiagram";
import CostBreakdown from "./CostBreakdown";
import type { Focus } from "@/lib/calculators";

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-stone-700">{label}</span>
      {children}
      {hint && <span className="mt-0.5 block text-xs text-stone-400">{hint}</span>}
    </label>
  );
}
const ctl = "mt-1 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 focus:outline-none";
const sel = (e: React.FocusEvent<HTMLInputElement>) => e.target.select();

function Row({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between border-t border-stone-100 py-2">
      <span className="text-sm text-stone-600">{label}</span>
      <span className="text-right">
        <span className={`font-semibold tabular-nums ${accent ? "text-amber-700" : "text-stone-900"}`}>{value}</span>
        {sub && <span className="ml-2 text-xs text-stone-400">{sub}</span>}
      </span>
    </div>
  );
}

export default function DeckCalculator({ initialState, focus }: { initialState?: string; focus?: Focus }) {
  const [inp, setInp] = useState<DeckInputs>({ ...DEFAULT_DECK, state: initialState ?? DEFAULT_DECK.state });
  const [decking, setDecking] = useState<Decking>(DEFAULT_DECKING);
  const [adv, setAdv] = useState(false);
  const r = useMemo(() => computeDeck(inp), [inp]);
  const cost = useMemo(() => computeCost({
    width: inp.width, projection: inp.projection, decking, postCount: r.postCount,
    needsGuard: r.needsGuard, stairTreads: r.stairs?.treads ?? 0, hasStairs: !!r.stairs,
  }), [inp.width, inp.projection, decking, r.postCount, r.needsGuard, r.stairs]);
  const set = <K extends keyof DeckInputs>(k: K, v: DeckInputs[K]) => setInp((p) => ({ ...p, [k]: v }));

  const headline = (() => {
    if (focus === "footing") return ["Footing", `${r.footingDiameterIn}″ dia. × ${r.footingDepthIn}″ deep`, `${r.footingLoadLb} lb/post · ${r.footingAreaSqft} ft² bearing`];
    if (focus === "stair" && r.stairs) return ["Stairs", `${r.stairs.risers} risers @ ${r.stairs.riserIn}″`, `${r.stairs.treads} treads · ${ftIn(r.stairs.totalRunIn)} total run`];
    if (focus === "beam") return ["Beam", r.beamSize.replace("-", " × "), `posts ≤ ${ftIn(r.beamMaxPostSpacingIn)} apart · ${r.postCount} posts`];
    if (focus === "ledger") return ["Ledger fasteners", `½″ lags @ ${r.ledgerLagSpacingIn}″`, `or ½″ bolts @ ${r.ledgerBoltSpacingIn}″ o.c.`];
    if (focus === "cost") return ["Estimated cost", `${money(cost.totalLow)}–${money(cost.totalHigh)}`, `${cost.deckAreaSqft} ft² · $${cost.perSqftLow}–${cost.perSqftHigh}/ft²`];
    return ["Joists", `${r.joistSize ?? "—"} @ ${inp.spacing}″ o.c.`, `spans ${ftIn(r.joistMaxSpanIn)} max`];
  })();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm print:hidden">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Deck width (ft)" hint="Along the house">
            <input type="number" min={4} className={ctl} value={inp.width} onFocus={sel}
              onChange={(e) => set("width", +e.target.value || 0)} />
          </Field>
          <Field label="Projection (ft)" hint="Out from the house = joist span">
            <input type="number" min={4} className={ctl} value={inp.projection} onFocus={sel}
              onChange={(e) => set("projection", +e.target.value || 0)} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Joist spacing">
            <select className={ctl} value={inp.spacing} onChange={(e) => set("spacing", +e.target.value as Spacing)}>
              <option value={12}>12&quot; o.c.</option>
              <option value={16}>16&quot; o.c.</option>
              <option value={24}>24&quot; o.c.</option>
            </select>
          </Field>
          <Field label="Deck height (ft)" hint="Surface above grade">
            <input type="number" min={0} step={0.5} className={ctl} value={inp.heightFt} onFocus={sel}
              onChange={(e) => set("heightFt", +e.target.value || 0)} />
          </Field>
        </div>
        <Field label="Lumber species" hint="No. 2 grade, pressure-treated for ground contact">
          <select className={ctl} value={inp.species} onChange={(e) => set("species", e.target.value as Species)}>
            {(Object.keys(SPECIES_LABEL) as Species[]).map((s) => <option key={s} value={s}>{SPECIES_LABEL[s]}</option>)}
          </select>
        </Field>
        <Field label="State" hint="Sets the footing depth below the frost line">
          <select className={ctl} value={inp.state} onChange={(e) => set("state", e.target.value)}>
            {US_STATES.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>
        </Field>
        <button type="button" onClick={() => setAdv((v) => !v)} className="text-xs font-medium text-amber-700 hover:text-amber-800">
          {adv ? "− Hide" : "+ Show"} advanced (override sizes, soil)
        </button>
        {adv && (
          <div className="grid grid-cols-2 gap-4 rounded-xl bg-stone-50 p-3">
            <Field label="Joist size">
              <select className={ctl} value={inp.joist} onChange={(e) => set("joist", e.target.value as JoistSize | "auto")}>
                <option value="auto">Auto (smallest that passes)</option>
                {JOIST_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Beam">
              <select className={ctl} value={inp.beam} onChange={(e) => set("beam", e.target.value as BeamSize | "auto")}>
                <option value="auto">Auto</option>
                {BEAM_SIZES.map((s) => <option key={s} value={s}>{s.replace("-", " × ")}</option>)}
              </select>
            </Field>
            <Field label="Soil bearing (psf)" hint="IRC R401.4.1 — 1,500 default">
              <input type="number" min={1500} step={500} className={ctl} value={inp.soilBearing} onFocus={sel}
                onChange={(e) => set("soilBearing", +e.target.value || 1500)} />
            </Field>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {focus && (
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-5">
            <div className="text-xs font-semibold tracking-wide text-stone-500 uppercase">{headline[0]}</div>
            <div className="mt-1 text-3xl font-bold text-stone-900">{headline[1]}</div>
            <div className="mt-1 text-sm text-stone-600">{headline[2]}</div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className={`rounded-2xl border p-5 ${r.joistOk ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
            <div className="text-xs font-semibold tracking-wide text-stone-500 uppercase">Joists</div>
            <div className="mt-1 text-2xl font-bold text-stone-900">{r.joistSize ?? "—"}</div>
            <div className="mt-1 text-sm text-stone-600">{inp.spacing}&quot; o.c. · spans {ftIn(r.joistMaxSpanIn)} max</div>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="text-xs font-semibold tracking-wide text-stone-500 uppercase">Beam</div>
            <div className="mt-1 text-2xl font-bold text-stone-900">{r.beamSize.replace("-", " × ")}</div>
            <div className="mt-1 text-sm text-stone-600">posts ≤ {ftIn(r.beamMaxPostSpacingIn)} apart</div>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="mb-1 flex items-center justify-between">
            <div className="text-sm font-semibold text-stone-700">Code-compliant framing plan</div>
            <button type="button" onClick={() => window.print()} className="text-xs font-medium text-amber-700 hover:text-amber-800 print:hidden">Print / save PDF</button>
          </div>
          <FramingDiagram width={inp.width} projection={inp.projection} joistCount={r.joistCount}
            postCount={r.postCount} joistSize={r.joistSize} beamSize={r.beamSize} postSpacingIn={r.postSpacingIn} valid={r.valid} />
          <Row label="Joists" value={`${r.joistCount} × ${r.joistSize ?? "—"}`} sub={`${r.joistLinealFt} lin ft`} accent={focus === "joist"} />
          <Row label="Beam" value={r.beamSize.replace("-", " × ")} sub="IRC R507.5" accent={focus === "beam"} />
          <Row label="Support posts" value={`${r.postCount} × 6x6`} sub={`${ftIn(r.postSpacingIn)} apart`} />
          <Row label="Footing size" value={`${r.footingDiameterIn}″ dia.`} sub={`${r.footingAreaSqft} ft² · ${r.footingLoadLb} lb/post`} accent={focus === "footing"} />
          <Row label="Footing depth" value={`${r.footingDepthIn}″`} sub="below grade (frost line)" accent={focus === "footing"} />
          <Row label="Concrete" value={`${r.concreteBags80} × 80-lb bags`} sub={`${r.footingConcreteCuFt} ft³ per pier`} accent={focus === "footing"} />
          <Row label="Ledger fasteners" value={`½″ lag @ ${r.ledgerLagSpacingIn}″`} sub={`or bolt @ ${r.ledgerBoltSpacingIn}″ · R507.9`} accent={focus === "ledger"} />
          {r.stairs && <Row label="Stairs" value={`${r.stairs.risers} risers @ ${r.stairs.riserIn}″`} sub={`${r.stairs.treads} treads · ${ftIn(r.stairs.totalRunIn)} run`} accent={focus === "stair"} />}
          <Row label="Guardrail" value={r.needsGuard ? `${r.guardHeightIn}″ required` : "Optional (≤30″)"} sub="IRC R312" />
          <p className="mt-3 text-xs text-stone-400">
            Member sizes read from the IRC R507.6 (joists) and R507.5 (beams) tables for No.&nbsp;2
            {" "}{SPECIES_LABEL[inp.species]} at 40&nbsp;psf live + 10&nbsp;psf dead. Footings from tributary load ÷
            soil bearing (R507.3); ledger fasteners per R507.9. Confirm with your local building department.
          </p>
        </div>

        <CostBreakdown cost={cost} decking={decking} onDecking={setDecking} />

        {r.warnings.length > 0 && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <div className="font-semibold">Heads up</div>
            <ul className="mt-1 list-disc space-y-1 pl-5">{r.warnings.map((w) => <li key={w}>{w}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}
