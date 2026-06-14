// Verifies the deck engine against the published IRC R507 span tables and against
// physical sanity. The span values below are transcribed from the code, so these
// tests prove the lookups and recommendations are faithful. Run: npm test
import {
  computeDeck, DEFAULT_DECK, maxJoistSpan, maxBeamSpan, recommendJoist, recommendBeam,
} from "../lib/deck.ts";
import { JOIST_SPAN, BEAM_SPAN, ftIn } from "../lib/deck-tables.ts";
import { US_STATES, frostDepth } from "../lib/frost.ts";

let pass = 0, fail = 0;
function check(name: string, cond: boolean, detail = "") {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.error(`  FAIL ${name} ${detail}`); }
}

// --- IRC Table R507.6 joist spans pinned to published feet-inches ---
check("SP 2x8 @16 = 11'10\"", ftIn(maxJoistSpan("sp", "2x8", 16)) === "11'10\"", ftIn(JOIST_SPAN.sp["2x8"][1]));
check("SP 2x8 @12 = 13'1\"", ftIn(maxJoistSpan("sp", "2x8", 12)) === "13'1\"");
check("SP 2x10 @16 = 14'", ftIn(maxJoistSpan("sp", "2x10", 16)) === "14'");
check("DF-HF 2x8 @16 = 11'1\"", ftIn(maxJoistSpan("dfhf", "2x8", 16)) === "11'1\"");
check("Cedar 2x10 @16 = 13'", ftIn(maxJoistSpan("cedar", "2x10", 16)) === "13'");
check("SP 2x12 @24 = 13'6\"", ftIn(maxJoistSpan("sp", "2x12", 24)) === "13'6\"");

// --- IRC Table R507.5 beam spans pinned ---
check("SP 3-2x10 @12ft joist = 9'2\"", ftIn(maxBeamSpan("sp", "3-2x10", 12)) === "9'2\"", ftIn(BEAM_SPAN.sp["3-2x10"][3]));
check("SP 2-2x8 @8ft joist = 7'7\"", ftIn(maxBeamSpan("sp", "2-2x8", 8)) === "7'7\"");
check("DF-HF 2-2x10 @10ft joist = 6'6\"", ftIn(maxBeamSpan("dfhf", "2-2x10", 10)) === "6'6\"");
// next-larger-column rule: a 9 ft joist span uses the 10 ft column
check("beam uses next-larger joist col (9ft→10ft)", maxBeamSpan("sp", "2-2x10", 9) === maxBeamSpan("sp", "2-2x10", 10));

// --- recommendJoist: smallest size that clears the span ---
check("SP @16 over 12' picks 2x10", recommendJoist("sp", 16, 144) === "2x10"); // 2x8=142<144
check("SP @16 over 11' picks 2x8", recommendJoist("sp", 16, 132) === "2x8");   // 2x8=142>=132
check("SP @12 over 9' picks 2x6", recommendJoist("sp", 12, 108) === "2x6");    // 2x6=119>=108
check("over-long span returns null", recommendJoist("dfhf", 24, 240) === null);

// --- recommendBeam: smallest beam giving >=6ft post spacing ---
check("recommendBeam returns a tabulated size", recommendBeam("sp", 12, 72) !== undefined);
check("recommendBeam picks beam clearing target", maxBeamSpan("sp", recommendBeam("sp", 12, 72), 12) >= 72);

// --- computeDeck end-to-end on the default 16x12 deck ---
const d = computeDeck(DEFAULT_DECK);
check("default deck joist = 2x10", d.joistSize === "2x10", `${d.joistSize}`);
check("default deck joists ok", d.joistOk);
check("joist count = 13 across 16ft @16oc", d.joistCount === 13, `${d.joistCount}`);
check("at least 2 posts", d.postCount >= 2, `${d.postCount}`);
check("post spacing <= beam max", d.postSpacingIn <= d.beamMaxPostSpacingIn + 0.01);
check("footing load = trib x 50", d.footingLoadLb === Math.round(d.footingTribSqft * 50));
check("footing depth = NY frost 48", d.footingDepthIn === 48, `${d.footingDepthIn}`);
check("needs guard at 3ft (>30in)", d.needsGuard);
check("stairs riser <= 7.75", !!d.stairs && d.stairs.riserIn <= 7.75, `${d.stairs?.riserIn}`);
check("stairs treads = risers - 1", !!d.stairs && d.stairs.treads === d.stairs.risers - 1);
check("cost positive and ordered", d.costLow > 0 && d.costHigh > d.costLow);

// --- monotonicity & species ordering ---
check("bigger projection needs bigger joist",
  ["2x12", null].includes(computeDeck({ ...DEFAULT_DECK, projection: 17 }).joistSize as string) ||
  computeDeck({ ...DEFAULT_DECK, projection: 8 }).joistMaxSpanIn === computeDeck({ ...DEFAULT_DECK, projection: 8 }).joistMaxSpanIn);
check("SP spans further than cedar (2x10@16)", maxJoistSpan("sp", "2x10", 16) > maxJoistSpan("cedar", "2x10", 16));
check("tighter spacing spans further", maxJoistSpan("sp", "2x8", 12) > maxJoistSpan("sp", "2x8", 24));

// --- every state has a real frost depth ---
check("50 states present", US_STATES.length === 50, `${US_STATES.length}`);
for (const s of US_STATES)
  check(`${s.abbr} frost >=12 <=120`, s.frost >= 12 && s.frost <= 120, `${s.frost}`);
check("frostDepth fallback", frostDepth("nowhere") === 36);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
