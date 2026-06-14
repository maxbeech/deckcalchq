// Deck framing engine — a transparent, deterministic IRC R507 / DCA6 prescriptive
// sizing tool. Every member size is looked up in the real code span tables
// (deck-tables.ts), every footing is computed from tributary load over soil
// bearing, and every result carries its code citation. Pure + client-side.

import {
  BEAM_SPAN, JOIST_SPAN, JOIST_SIZES, JOIST_SPAN_COLS, ftIn,
  type BeamSize, type JoistSize, type Spacing, type Species,
} from "./deck-tables";
import { frostDepth } from "./frost";

export interface DeckInputs {
  width: number;       // ft, parallel to the house (ledger length)
  projection: number;  // ft, out from the house (= joist clear span)
  spacing: Spacing;    // joist spacing, on-center inches
  species: Species;
  beam: BeamSize | "auto";
  joist: JoistSize | "auto";
  heightFt: number;    // deck surface height above grade
  state: string;       // slug, for frost depth
  soilBearing: number; // psf (presumptive load-bearing value, IRC Table R401.4.1)
}

export interface DeckResult {
  joistSize: JoistSize | null;
  joistMaxSpanIn: number;
  joistOk: boolean;
  joistCount: number;
  joistLinealFt: number;
  beamSize: BeamSize;
  beamMaxPostSpacingIn: number;
  postCount: number;
  postSpacingIn: number;
  postSize: string;
  footingTribSqft: number;
  footingLoadLb: number;
  footingAreaSqft: number;
  footingDiameterIn: number;
  footingDepthIn: number;
  guardHeightIn: number;
  needsGuard: boolean;
  stairs: { risers: number; riserIn: number; treads: number; treadRunIn: number; totalRunIn: number } | null;
  deckAreaSqft: number;
  costLow: number;
  costHigh: number;
  warnings: string[];
  fmt: (inches: number) => string;
}

const FOOTINGS = [12, 16, 18, 20, 24, 30, 36]; // common round/square footing sizes, in

export function maxJoistSpan(sp: Species, size: JoistSize, spacing: Spacing): number {
  const idx = spacing === 12 ? 0 : spacing === 16 ? 1 : 2;
  return JOIST_SPAN[sp][size][idx];
}

// Smallest joist that clears a target span (inches) at the given spacing.
export function recommendJoist(sp: Species, spacing: Spacing, targetIn: number): JoistSize | null {
  for (const s of JOIST_SIZES) if (maxJoistSpan(sp, s, spacing) >= targetIn) return s;
  return null;
}

// Max beam span (inches) for a supported joist span (ft). Uses the next-larger
// tabulated joist-span column (conservative, matches how examiners read R507.5).
export function maxBeamSpan(sp: Species, beam: BeamSize, joistSpanFt: number): number {
  let col = JOIST_SPAN_COLS.findIndex((c) => c >= joistSpanFt);
  if (col === -1) col = JOIST_SPAN_COLS.length - 1; // beyond table → use widest (flag separately)
  return BEAM_SPAN[sp][beam][col];
}

// Smallest beam that allows at least `targetPostSpacingIn` between posts.
export function recommendBeam(sp: Species, joistSpanFt: number, targetIn: number): BeamSize {
  const order: BeamSize[] = ["2-2x6", "2-2x8", "2-2x10", "3-2x8", "2-2x12", "3-2x10", "3-2x12"];
  for (const b of order) if (maxBeamSpan(sp, b, joistSpanFt) >= targetIn) return b;
  return "3-2x12";
}

export function computeDeck(inp: DeckInputs): DeckResult {
  const warnings: string[] = [];
  const projIn = inp.projection * 12;
  const widthIn = inp.width * 12;

  // --- Joists (IRC R507.6) ---
  const recJoist = recommendJoist(inp.species, inp.spacing, projIn);
  const joistSize = inp.joist === "auto" ? recJoist : inp.joist;
  const joistMaxSpanIn = joistSize ? maxJoistSpan(inp.species, joistSize, inp.spacing) : 0;
  const joistOk = !!joistSize && joistMaxSpanIn >= projIn;
  if (!recJoist)
    warnings.push(`A ${inp.projection} ft projection exceeds the IRC R507.6 prescriptive joist table — use a flush mid-beam, a drop beam, or an engineered design.`);
  if (joistSize && !joistOk)
    warnings.push(`A ${joistSize} joist only spans ${ftIn(joistMaxSpanIn)} at ${inp.spacing}" o.c.; your deck projects ${ftIn(projIn)}. Step up a size or tighten spacing.`);
  const joistCount = Math.floor(widthIn / inp.spacing) + 1;
  const joistLinealFt = Math.round(joistCount * inp.projection);

  // --- Beam (IRC R507.5) — joists span ledger→beam, so supported span = projection ---
  const beamSize = inp.beam === "auto" ? recommendBeam(inp.species, inp.projection, 72) : inp.beam;
  const beamMaxPostSpacingIn = maxBeamSpan(inp.species, beamSize, inp.projection);
  if (inp.projection > 18)
    warnings.push("Supported joist span exceeds 18 ft (top of the R507.5 beam table) — an engineered beam is required.");
  const postCount = Math.max(2, Math.ceil(widthIn / beamMaxPostSpacingIn) + 1);
  const postSpacingIn = widthIn / (postCount - 1);

  // --- Posts (IRC R507.4) — 6x6 is the prescriptive minimum; 4x4 only for low decks ---
  const postSize = inp.heightFt <= 4 ? '6x6 (4x4 permitted on low decks where allowed locally)' : "6x6";

  // --- Footings (IRC R507.3) — tributary load over presumptive soil bearing ---
  const tributarySqft = (postSpacingIn / 12) * (inp.projection / 2);
  const loadLb = Math.round(tributarySqft * 50); // 40 LL + 10 DL
  const areaSqft = loadLb / inp.soilBearing;
  const reqDiaIn = Math.sqrt(areaSqft / Math.PI) * 2 * 12;
  const footingDiameterIn = FOOTINGS.find((d) => d >= reqDiaIn) ?? 36;
  if (reqDiaIn > 36) warnings.push("Required footing exceeds 36\" — verify soil bearing or add posts.");
  const footingDepthIn = frostDepth(inp.state);

  // --- Stairs (IRC R311.7) ---
  let stairs: DeckResult["stairs"] = null;
  if (inp.heightFt > 0.6) {
    const totalRise = inp.heightFt * 12;
    let risers = Math.round(totalRise / 7.25);
    if (totalRise / risers > 7.75) risers += 1;
    const riserIn = totalRise / risers;
    const treads = Math.max(1, risers - 1);
    const treadRunIn = 11; // 10" min run + 1" nosing (R311.7.5)
    stairs = { risers, riserIn: Math.round(riserIn * 100) / 100, treads, treadRunIn, totalRunIn: treads * treadRunIn };
  }

  // --- Guard (IRC R312) — required when walking surface > 30" above grade ---
  const needsGuard = inp.heightFt * 12 > 30;

  // --- Materials & cost (real US ranges, 2026) ---
  const deckAreaSqft = Math.round(inp.width * inp.projection);
  const perSqLow = inp.species === "cedar" ? 25 : 20; // DIY material + basic labor
  const perSqHigh = inp.species === "cedar" ? 55 : 45; // contractor-installed
  return {
    joistSize, joistMaxSpanIn, joistOk, joistCount, joistLinealFt,
    beamSize, beamMaxPostSpacingIn, postCount, postSpacingIn,
    postSize, footingTribSqft: Math.round(tributarySqft * 10) / 10, footingLoadLb: loadLb,
    footingAreaSqft: Math.round(areaSqft * 100) / 100, footingDiameterIn, footingDepthIn,
    guardHeightIn: 36, needsGuard, stairs, deckAreaSqft,
    costLow: deckAreaSqft * perSqLow, costHigh: deckAreaSqft * perSqHigh,
    warnings, fmt: ftIn,
  };
}

export const DEFAULT_DECK: DeckInputs = {
  width: 16, projection: 12, spacing: 16, species: "sp",
  beam: "auto", joist: "auto", heightFt: 3, state: "new-york", soilBearing: 1500,
};
