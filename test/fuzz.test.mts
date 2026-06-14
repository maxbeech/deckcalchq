// Exhaustive fuzz across every engine input combination: proves no combo of deck
// size, spacing, species, state, height, decking or railing input ever yields a
// NaN, a negative, a crash, an over-7¾" stair riser, or a ≥4" baluster gap.
// Run: npm test (runs after the unit tests).
import { computeDeck, DEFAULT_DECK } from "../lib/deck.ts";
import { SPECIES_LABEL, JOIST_SIZES, BEAM_SIZES, SPACINGS, type Species } from "../lib/deck-tables.ts";
import { US_STATES } from "../lib/frost.ts";
import { computeRailing } from "../lib/railing.ts";
import { computeCost } from "../lib/cost.ts";

let n = 0, bad = 0;
const fail = (m: string) => { bad++; if (bad <= 20) console.error("  BAD:", m); };
const okNum = (v: number) => Number.isFinite(v) && !Number.isNaN(v);

const widths = [2, 4, 8, 12, 16, 20, 24, 30, 40, 60];
const projs = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 25, 40];
const heights = [0, 0.5, 1, 2, 3, 4, 6, 8, 12, 20];
const species = Object.keys(SPECIES_LABEL) as Species[];

for (const sp of species) for (const spacing of SPACINGS) for (const w of widths) for (const p of projs) for (const h of heights) {
  n++;
  const r = computeDeck({ ...DEFAULT_DECK, species: sp, spacing, width: w, projection: p, heightFt: h });
  for (const [k, v] of Object.entries(r)) if (typeof v === "number" && (!okNum(v) || v < 0)) fail(`deck ${sp}/${spacing}/${w}x${p}/h${h} ${k}=${v}`);
  if (r.postCount < 2) fail(`postCount<2 ${w}x${p}`);
  if (r.footingDepthIn < 12) fail(`frost<12 ${w}x${p}`);
  if (r.stairs && (r.stairs.riserIn > 7.76 || r.stairs.riserIn <= 0)) fail(`riser ${r.stairs.riserIn} h${h}`);
  if (r.joistOk && r.joistMaxSpanIn < p * 12) fail(`joistOk but span short ${w}x${p}`);
}
for (const s of US_STATES) { n++; if (computeDeck({ ...DEFAULT_DECK, state: s.slug }).footingDepthIn !== s.frost) fail(`state ${s.slug}`); }
for (const j of JOIST_SIZES) for (const b of BEAM_SIZES) { n++; if (!okNum(computeDeck({ ...DEFAULT_DECK, joist: j, beam: b }).beamMaxPostSpacingIn)) fail(`override ${j}/${b}`); }
for (const g of [{ width: -5 }, { projection: -1 }, { width: 0, projection: 0 }, { heightFt: -3 }, { soilBearing: -100 }, { width: 1e6 }]) {
  n++; if (!okNum(computeDeck({ ...DEFAULT_DECK, ...g } as never).footingLoadLb)) fail(`garbage ${JSON.stringify(g)}`);
}

const styles = ["wood2x2", "square075", "round1", "colonial"] as const;
for (const st of styles) for (let len = 1; len <= 200; len += 9) for (const ps of [2, 3, 4, 5, 6, 7, 8]) for (const gap of [2, 2.5, 3, 3.5, 3.9]) {
  n++; const r = computeRailing({ railLengthFt: len, postSpacingFt: ps, style: st, maxGapIn: gap, postWidthIn: 3.5 });
  if (!okNum(r.evenGapIn) || r.evenGapIn >= 4) fail(`rail gap ${r.evenGapIn} ${st}/${len}/${ps}/${gap}`);
  if (r.totalBalusters < 0 || !Number.isInteger(r.totalBalusters)) fail(`rail balusters ${r.totalBalusters}`);
}
for (const g of [{ railLengthFt: 0 }, { railLengthFt: -10 }, { postSpacingFt: 0 }, { maxGapIn: 10 }, { maxGapIn: 0 }]) {
  n++; if (computeRailing({ railLengthFt: 40, postSpacingFt: 6, style: "wood2x2", maxGapIn: 3.5, postWidthIn: 3.5, ...g } as never).evenGapIn >= 4) fail(`rail garbage ${JSON.stringify(g)}`);
}

for (const d of ["pt", "cedar", "composite", "hardwood"] as const) for (const w of widths) for (const p of projs) {
  n++; const c = computeCost({ width: w, projection: p, decking: d, postCount: 4, needsGuard: true, stairTreads: 4, hasStairs: true });
  if (!okNum(c.totalLow) || c.totalLow <= 0 || c.totalHigh < c.totalLow) fail(`cost ${d}/${w}x${p}`);
  if (c.items.reduce((s, i) => s + i.low, 0) !== c.totalLow) fail(`cost sum ${d}/${w}x${p}`);
}

console.log(`\nfuzz: ${n} cases, ${bad} bad`);
process.exit(bad === 0 ? 0 : 1);
