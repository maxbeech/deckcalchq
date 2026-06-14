# DeckCalc HQ

Free deck building code calculator — sizes deck **joists, beams, posts, footings and stairs**
to the real **IRC R507 / AWC DCA6** prescriptive deck code, with each US state's frost depth and a
permit-ready breakdown.

Live: https://deckcalchq.vercel.app

## What it does

- **Joist & beam sizing** straight from the IRC Table R507.6 (joists) and R507.5 (beams) span
  tables — by lumber size, spacing and species (Southern Pine, Douglas Fir-Larch/Hem-Fir/SPF,
  Redwood/Cedar group). No fabricated numbers; values are transcribed from the code.
- **Footing size** from tributary post load ÷ soil bearing (IRC R507.3), and **footing depth**
  below the frost line for the chosen state (IRC R403.1.4).
- **Ledger fastener spacing** (½″ lag / through-bolt) per IRC Table R507.9.1.3.
- **Stair layout** (risers, treads, total run, landing) to IRC R311.7, **guard height** to R312.
- **Scale framing diagram** (SVG plan view of joists, beam, posts & footings).
- **Itemized cost & materials** (`lib/cost.ts`): decking by material, board/screw counts,
  substructure, footings, railing, stairs, permit — DIY-material to contractor-installed range.
- **Full span tables** (joist R507.6 × 3 species, beam R507.5) rendered from the same data the
  engine uses (single source of truth), and a **/methodology** page citing every code source.

## SEO surface

- Per-calculator pages: deck joist span, deck beam span, deck footing, deck stair, deck cost.
- Per-state deck-code pages (50 states) with local frost depth + permit guidance.
- Deck building guides (blog), sitemap, robots, JSON-LD.

## Monetisation

- **Free** calculator (the SEO wedge).
- **Pro** ($29 one-time) permit-ready deck plan PDF — Stripe checkout, env-gated
  (`STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`), degrades gracefully when unset.
- Deck-builder lead-gen network.

## Stack

Next.js 16 (App Router) · Tailwind CSS 4 · TypeScript · tsx tests. Free calculator is pure
client-side — no database.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # validates the engine against published IRC R507 span values
npm run build
```

> Planning aid only. Local amendments vary — confirm member sizes, footing depth and connections
> with your building department before you build.
