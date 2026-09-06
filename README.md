# Falcon Reserve

A luxury financial & digital-asset education platform built with Next.js 15
(App Router), TypeScript, Tailwind CSS, and lucide-react.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Structure

- `app/page.tsx` — home page (hero, philosophy strip, bento dashboard)
- `app/quiz/page.tsx` — interactive 15-question knowledge assessment with
  real-time scoring and a final rank (client component)
- `app/game/page.tsx` — 2D canvas platformer (coins + tiered question chests)
- `app/runner/page.tsx` — 3D endless runner (React Three Fiber) with lane
  switching, jump/slide, instanced obstacles/coins, and tiered question signs
- `app/community/page.tsx` — Instagram-style investment feed (mock/seeded
  data — see `lib/communityData.ts` for how to swap in a real API)
- `components/HeroGameBanner.tsx` — animated canvas hero banner for the game
- `components/community/` — `CommunityFeed.tsx` (infinite scroll, debounced
  search, optimistic like/bookmark/comment), `PostCard.tsx`, `PostComposer.tsx`
- `components/game/FinancialPlatformer.tsx` — 2D canvas engine
- `components/game/Runner3DGame.tsx` — 3D runner engine (client-only)
- `components/game/Runner3DGameLoader.tsx` — `next/dynamic(..., { ssr: false })`
  wrapper so the WebGL canvas never touches the server render
- `app/stocks/page.tsx` — equities principles
- `app/crypto/page.tsx` — digital asset principles
- `app/about/page.tsx` — philosophy / brand story
- `app/privacy/page.tsx` — privacy policy
- `app/disclaimer/page.tsx` — risk disclaimer
- `lib/quizData.ts` — typed question bank (beginner / ethics / expert tiers)
  and rank-calculation logic
- `components/Navbar.tsx`, `components/Footer.tsx`, `components/FalconMark.tsx`

## Type-checking & build

```bash
npx tsc --noEmit
npm run build
```

All components are strictly typed (`strict: true`,
`noUncheckedIndexedAccess: true`), and client/server boundaries are marked
explicitly with `"use client"` only where interactivity (state, hooks) is
required — every other route is a server component by default.

## Security

`next`, `react`, and `react-dom` are pinned above the versions affected by
CVE-2025-55182 / CVE-2025-66478 (critical RCE in React Server Components).
`@react-three/fiber` and `@react-three/drei` were bumped to their v9/v10
lines to match React 19, since v8/v9-for-react-18 combinations are not
compatible with React 19's reconciler.

## Deploying to Netlify

This is a full Next.js App Router app (server components, dynamic routes),
not a static export — Netlify needs to know that, or it serves its own
generic 404 page for every route.

`netlify.toml` is already set up for this:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

If you're still seeing Netlify's "Page not found" card after deploying:

- **Connect the Git repo** in the Netlify UI (New site → Import an existing
  project) rather than dragging a pre-built folder into the deploy drop
  zone — drag-and-drop deploys skip the build step entirely, so
  `netlify.toml` and the Next.js plugin never run.
- Check the **deploy log** for the actual build command that ran and
  confirm it matches `npm run build` with publish directory `.next`.
- Confirm the **Next.js Runtime plugin** (`@netlify/plugin-nextjs`) shows
  up as installed in Site settings → Build & deploy → Post processing —
  Netlify auto-installs it from `netlify.toml`, but older sites created
  before this file existed may need it added manually from the Netlify
  plugin directory.
- Node version: this project needs Node 18.18+ (20 is set via
  `netlify.toml`'s `NODE_VERSION`). An older pinned Node version on the
  site can fail the build silently and fall back to a 404.

## Deploying to Vercel

No extra config needed — Vercel detects Next.js automatically. Push the
repo and import it in the Vercel dashboard, or run `vercel` from this
directory with the Vercel CLI.
