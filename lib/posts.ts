export type Block =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export interface Post {
  slug: string;
  title: string;
  description: string;
  keyword: string;
  date: string;
  readMins: number;
  body: Block[];
}

export const POSTS: Post[] = [
  {
    slug: "how-far-can-a-deck-joist-span",
    title: "How Far Can a Deck Joist Span?",
    description: "Maximum deck joist spans for 2x6, 2x8, 2x10 and 2x12 lumber at 12, 16 and 24 inch spacing — straight from the IRC R507.6 deck table.",
    keyword: "how far can a deck joist span",
    date: "2026-06-14",
    readMins: 6,
    body: [
      { type: "p", text: "A deck joist's maximum span depends on three things: the joist size, how far apart the joists sit (the on-center spacing), and the species of lumber. The building code publishes these limits in IRC Table R507.6, and every plans examiner checks your drawings against it. Here is what those numbers actually look like." },
      { type: "h2", text: "Southern Pine joist spans (No. 2 grade)" },
      { type: "ul", items: [
        "2x6 — 9'11\" at 12\" o.c., 9'0\" at 16\", 7'7\" at 24\"",
        "2x8 — 13'1\" at 12\" o.c., 11'10\" at 16\", 9'8\" at 24\"",
        "2x10 — 16'2\" at 12\" o.c., 14'0\" at 16\", 11'5\" at 24\"",
        "2x12 — 18'0\" at 12\" o.c., 16'6\" at 16\", 13'6\" at 24\"",
      ] },
      { type: "p", text: "Douglas Fir-Larch and Hem-Fir span a little less than Southern Pine; cedar, redwood and the lighter pines span less again. Our calculator carries all three species groups and picks the smallest joist that clears your deck's projection automatically." },
      { type: "h2", text: "Why spacing matters so much" },
      { type: "p", text: "Closer joists share the load, so a 2x8 Southern Pine joist goes from 13'1\" at 12\" spacing down to 9'8\" at 24\". If your deck is just past a joist's limit, tightening the spacing one step is often cheaper than jumping up a lumber size — and it stiffens the deck underfoot." },
      { type: "h2", text: "A note on cantilevers" },
      { type: "p", text: "Joists can overhang the beam to form a small cantilever, but the IRC limits that overhang to one quarter of the actual back-span (R507.6.1). A deck that spans 12 ft to the beam can cantilever up to 3 ft past it — handy for stairs or a clean fascia line." },
    ],
  },
  {
    slug: "what-size-beam-for-a-deck",
    title: "What Size Beam Does My Deck Need?",
    description: "How to pick a deck beam size from the IRC R507.5 table based on the joist span it carries and how far the beam must reach between posts.",
    keyword: "what size beam for a deck",
    date: "2026-06-14",
    readMins: 6,
    body: [
      { type: "p", text: "A deck beam carries every joist that lands on it down to the posts. The bigger the area it supports and the farther it has to reach between posts, the beefier it has to be. IRC Table R507.5 ties those together: you look up the beam by the joist span it supports, and it tells you the maximum distance allowed between posts." },
      { type: "h2", text: "Beam span is driven by the joist span" },
      { type: "p", text: "This trips people up. A 3-ply 2x10 Southern Pine beam can span about 13 ft between posts when it carries 6-ft joists, but only about 10 ft when it carries 12-ft joists — same beam, more load, shorter reach. Always size the beam against the actual joist span it supports, not the deck's width." },
      { type: "h2", text: "Two-ply vs three-ply" },
      { type: "p", text: "Built-up beams are made by nailing or bolting 2x stock together. Adding a third ply to a beam of the same depth buys a meaningful jump in span — often the cheapest way to delete a post and a footing. A 3-2x10 reaches noticeably farther than a 2-2x10." },
      { type: "h2", text: "Don't forget the connections" },
      { type: "ul", items: [
        "Built-up beams must be fastened together per IRC R507.5.2 (a specific nail or bolt pattern).",
        "Posts to a dropped beam need a rated post cap, not just toe-nails.",
        "Where the beam sits on notched posts, the notch and bolts must follow R507.4.",
      ] },
      { type: "p", text: "Enter your deck in the calculator and it returns the recommended beam, the maximum post spacing, and how many posts your deck width needs — all from the R507.5 table." },
    ],
  },
  {
    slug: "deck-footing-size-and-depth",
    title: "Deck Footing Size and Depth, Explained",
    description: "How to work out deck footing diameter from post load and soil bearing, and how deep footings must go below the frost line in your state.",
    keyword: "deck footing size",
    date: "2026-06-14",
    readMins: 5,
    body: [
      { type: "p", text: "Footings do two jobs: spread the deck's weight over enough soil that it won't sink, and reach deep enough that frost can't lift them. Get either wrong and the deck racks, the ledger pulls, or doors stop closing after the first hard winter." },
      { type: "h2", text: "Footing size = load ÷ soil bearing" },
      { type: "p", text: "Each post carries a tributary slice of the deck — roughly the post spacing times half the joist span. Multiply that area by 50 psf (40 live + 10 dead) to get the load on the footing, then divide by your soil's bearing value to get the bearing area it needs. The IRC presumptive value for ordinary sand, silt or clay is 1,500 psf; gravel bears far more." },
      { type: "h2", text: "Depth follows the frost line" },
      { type: "p", text: "The bottom of the footing must sit below the local frost line so freezing soil can't heave it. That's about 12\" in the frost-free South, 36–48\" across the Midwest, and up to 60\" in the upper Midwest and New England. Even where the ground never freezes, you still need roughly 12\" to reach firm, undisturbed soil." },
      { type: "h2", text: "Get the footing inspected before you pour" },
      { type: "p", text: "Almost every jurisdiction requires an open-hole footing inspection before concrete goes in — it's the one part of the deck nobody can see afterward. Pick your state in the calculator to set the depth, and it sizes the footing diameter from your deck's actual loads." },
    ],
  },
  {
    slug: "how-to-build-deck-stairs",
    title: "How to Build Code-Compliant Deck Stairs",
    description: "Lay out deck stairs to IRC R311.7 — riser height, tread depth, stringer spacing and the total run you need from your deck height.",
    keyword: "deck stair calculator",
    date: "2026-06-14",
    readMins: 5,
    body: [
      { type: "p", text: "Stairs are the part of a deck most likely to fail inspection, because the riser and tread dimensions are tightly controlled and easy to get wrong. The fix is to start from the total height and work backward to a legal riser." },
      { type: "h2", text: "The numbers that matter (IRC R311.7)" },
      { type: "ul", items: [
        "Maximum riser height: 7¾\". Minimum tread depth: 10\".",
        "Every riser in a flight must be within 3/8\" of the others — uniformity is strictly enforced.",
        "Minimum stair width: 36\". Minimum headroom: 6'8\".",
        "Four or more risers require a graspable handrail, 34–38\" above the nosings.",
      ] },
      { type: "h2", text: "Working out the layout" },
      { type: "p", text: "Take the total rise from the deck surface to the landing and divide by about 7.25\" to get a starting riser count, then round so no riser exceeds 7¾\". The number of treads is one less than the number of risers. At a 10–11\" run per tread, that gives you the total horizontal run you need to reserve at the bottom of the deck." },
      { type: "h2", text: "Stringers" },
      { type: "p", text: "Cut stringers are usually 2x12, and there's a limit on how far they can span unsupported — long flights need a mid-span support or solid (uncut) stringers. Our deck stair calculator turns your deck height into a full riser-and-tread layout in one step." },
    ],
  },
  {
    slug: "do-i-need-a-permit-to-build-a-deck",
    title: "Do I Need a Permit to Build a Deck?",
    description: "When a deck needs a building permit, what the inspector checks, and how to prepare drawings that pass the first time.",
    keyword: "do i need a permit to build a deck",
    date: "2026-06-14",
    readMins: 5,
    body: [
      { type: "p", text: "In almost every US jurisdiction, the answer is yes. A deck is a structure people stand on, often several feet in the air, attached to the house — so building departments want to see it before and during construction." },
      { type: "h2", text: "When a permit is required" },
      { type: "ul", items: [
        "Any deck attached to the house (because of the ledger connection).",
        "Any deck more than about 30\" above grade.",
        "Most freestanding decks above a small size threshold set locally.",
      ] },
      { type: "p", text: "Some areas exempt small, low, ground-level platforms — but check, because the threshold varies and an unpermitted deck can derail a home sale." },
      { type: "h2", text: "What the inspector checks" },
      { type: "ul", items: [
        "Footing depth and size (inspected open, before the pour).",
        "Ledger attachment and flashing — the #1 cause of deck collapses.",
        "Joist and beam sizes against the IRC R507 span tables.",
        "Post connections, guard height and stair dimensions.",
      ] },
      { type: "h2", text: "Passing the first time" },
      { type: "p", text: "Submit a simple plan that names your joist size and spacing, beam size, post spacing, footing size and depth, and stair layout — exactly the outputs this calculator gives you. When your drawings cite the same R507 tables the examiner uses, approval is usually quick." },
    ],
  },
  {
    slug: "how-much-does-a-deck-cost",
    title: "How Much Does It Cost to Build a Deck?",
    description: "Realistic 2026 deck cost ranges by size and material, where the money goes, and how much you save by doing your own framing.",
    keyword: "how much does a deck cost",
    date: "2026-06-14",
    readMins: 5,
    body: [
      { type: "p", text: "Deck cost scales with three things: size, material, and whether you build it yourself or hire a contractor. Knowing how those interact keeps your budget realistic before you ever buy lumber." },
      { type: "h2", text: "Typical ranges" },
      { type: "ul", items: [
        "DIY, pressure-treated pine: roughly $20–35 per square foot of deck.",
        "Contractor-built, pressure-treated: roughly $35–50 per square foot.",
        "Cedar or redwood, contractor-built: $45–60+ per square foot.",
        "Composite decking adds materially to the decking line but not the framing.",
      ] },
      { type: "p", text: "A 16x12 deck (192 sq ft) therefore runs from about $4,000 as a DIY pine build to $10,000+ contractor-installed in cedar." },
      { type: "h2", text: "Where the money goes" },
      { type: "p", text: "On a contractor-built deck, labor is roughly half the total — which is why doing your own framing is where the real savings are. Footings, stairs and railings are disproportionately expensive per square foot, so a simple rectangular deck close to the ground costs far less than a tall deck with multiple stair runs." },
      { type: "h2", text: "Estimate yours" },
      { type: "p", text: "Enter your deck size and species in the calculator for a build-cost range alongside a full framing plan, so your estimate is grounded in the actual lumber the deck needs." },
    ],
  },
  {
    slug: "deck-joist-spacing-12-vs-16-vs-24",
    title: "Deck Joist Spacing: 12 vs 16 vs 24 Inches",
    description: "How joist spacing changes your maximum span, decking choice and deck stiffness — and when to use 12, 16 or 24 inch on-center.",
    keyword: "deck joist spacing",
    date: "2026-06-14",
    readMins: 4,
    body: [
      { type: "p", text: "Joist spacing — the on-center distance between joists — is one of the biggest levers you have on a deck. It changes how far the joists can span, what decking you can run, and how solid the deck feels underfoot." },
      { type: "h2", text: "16\" on-center is the default" },
      { type: "p", text: "Most decks frame at 16\" o.c. It balances span, lumber cost and stiffness, and it suits standard decking laid perpendicular to the joists. A 2x8 Southern Pine joist spans 11'10\" at 16\"." },
      { type: "h2", text: "When to go to 12\"" },
      { type: "ul", items: [
        "You're laying decking on a diagonal (the boards span a longer distance between joists).",
        "You want a stiffer, bounce-free deck.",
        "You need a bit more span out of the joist size you have on hand.",
      ] },
      { type: "h2", text: "When 24\" works" },
      { type: "p", text: "24\" o.c. uses less lumber and is allowed by the tables, but it shortens the span, can feel springy, and many composite deck boards require 16\" or even 12\" spacing — always check the decking manufacturer's instructions. Run your numbers through the calculator at each spacing to see the trade-off." },
    ],
  },
  {
    slug: "how-many-footings-does-a-deck-need",
    title: "How Many Footings Does a Deck Need?",
    description: "How to work out the number of deck footings from your beam size, post spacing and deck width — and why bigger beams mean fewer holes to dig.",
    keyword: "how many footings for a deck",
    date: "2026-06-14",
    readMins: 4,
    body: [
      { type: "p", text: "The number of footings comes straight from how far your beam can span between posts. A beam that reaches farther needs fewer posts — and every post needs a footing — so beam size and footing count are directly linked." },
      { type: "h2", text: "Posts across the beam" },
      { type: "p", text: "Look up your beam's maximum post spacing in IRC Table R507.5, then divide your deck's width by it and round up. A 16-ft-wide deck with a beam good for 8 ft between posts needs three posts (two spans), so three footings along the beam, plus whatever the ledger and any stair posts require." },
      { type: "h2", text: "Fewer, bigger footings vs more, smaller ones" },
      { type: "ul", items: [
        "Upsizing the beam (e.g. 2-ply to 3-ply) can delete a post and a footing.",
        "Each footing still has to be big enough for the load its post carries — fewer posts means each footing carries more.",
        "On poor soil, you may need wider footings or more posts to keep bearing pressure in check.",
      ] },
      { type: "p", text: "The calculator reports the post count, spacing and the footing size each one needs, so you know exactly how many holes to dig and how big." },
    ],
  },
  {
    slug: "deck-ledger-board-attachment",
    title: "Deck Ledger Board Attachment Done Right",
    description: "Why the ledger is the most important connection on a deck, how to fasten and flash it to code, and when a free-standing deck is the better call.",
    keyword: "deck ledger board attachment",
    date: "2026-06-14",
    readMins: 5,
    body: [
      { type: "p", text: "Most catastrophic deck failures aren't the joists or the beam — they're the ledger pulling away from the house. The ledger is the board that bolts the deck to the building, and it carries half the deck's load straight into the wall framing." },
      { type: "h2", text: "Fasteners, not nails" },
      { type: "p", text: "The IRC (R507.9) requires a specific pattern of lag screws or through-bolts into the house's band joist — never nails, and never into just the sheathing. The bolt spacing depends on the joist span the ledger carries; longer joists put the bolts closer together." },
      { type: "h2", text: "Flashing is not optional" },
      { type: "ul", items: [
        "Water trapped behind a ledger rots the band joist until the bolts have nothing to hold.",
        "Flash over the top of the ledger and integrate it with the house's water-resistive barrier.",
        "Leave a small gap so water drains rather than wicking into the connection.",
      ] },
      { type: "h2", text: "When to go free-standing" },
      { type: "p", text: "If the band joist is questionable — engineered I-joists, a cantilevered floor, brick veneer, or stucco — a free-standing deck with its own beam and posts on the house side sidesteps the ledger problem entirely. It costs a little more in footings but removes the single biggest failure mode." },
    ],
  },
  {
    slug: "2x8-vs-2x10-deck-joists",
    title: "2x8 vs 2x10 Deck Joists: Which Should You Use?",
    description: "When to step up from 2x8 to 2x10 deck joists — the span difference, the cost, and how spacing factors in.",
    keyword: "2x8 vs 2x10 deck joists",
    date: "2026-06-14",
    readMins: 4,
    body: [
      { type: "p", text: "Choosing between 2x8 and 2x10 joists usually comes down to one question: how far does the deck project out from the house? The bigger joist buys span, but it also costs more and raises the deck's framing height." },
      { type: "h2", text: "The span difference" },
      { type: "p", text: "In Southern Pine at 16\" on-center, a 2x8 spans 11'10\" and a 2x10 spans 14'0\" — a bit over two extra feet. If your deck projects 12 ft, a 2x8 won't make it and you need the 2x10 (or you tighten the spacing to 12\", where the 2x8 reaches 13'1\")." },
      { type: "h2", text: "Cost and stiffness" },
      { type: "ul", items: [
        "2x10 lumber costs more per foot and is heavier to handle.",
        "A deeper joist is stiffer, so even within its allowable span the deck feels more solid.",
        "Deeper joists raise the framing — check it still tucks under the door threshold.",
      ] },
      { type: "h2", text: "Let the table decide" },
      { type: "p", text: "Rather than guess, enter your projection and spacing into the calculator. It returns the smallest joist that legally clears your span, so you only pay for the lumber you actually need." },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
