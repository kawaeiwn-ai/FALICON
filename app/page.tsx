import Link from "next/link";
import { TrendingUp, Coins, BrainCircuit, Compass, Users } from "lucide-react";
import FalconMark from "@/components/FalconMark";
import HeroGameBanner from "@/components/HeroGameBanner";

export default function HomePage() {
  return (
    <div>
      <HeroGameBanner />

      {/* Secondary hero: philosophy */}
      <section className="relative overflow-hidden bg-radial-fade">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1.15fr_0.85fr] md:py-32">
          <div className="rise-in">
            <p className="font-body text-sm text-champagne">
              Falcon Reserve
            </p>
            <h1 className="mt-5 font-display text-4xl leading-[1.1] text-ivory md:text-6xl">
              Wealth is built in decades,
              <br />
              not in candles on a chart.
            </h1>
            <p className="mt-6 max-w-lg font-body text-base leading-relaxed text-mute">
              Real investing is a game played over ten to twenty years, built
              to fund a future — not a bet on tomorrow's price. If you are
              hoping for gains by morning, you are not investing. You are
              gambling.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/quiz"
                className="rounded-sm border border-champagne bg-champagne/10 px-6 py-3 font-body text-sm text-champagne transition-all duration-300 hover:bg-champagne/20 hover:shadow-[0_0_24px_rgba(212,175,55,0.25)]"
              >
                Take the knowledge assessment
              </Link>
              <Link
                href="/about"
                className="font-body text-sm text-mute underline decoration-hairline underline-offset-4 transition-colors hover:text-ivory"
              >
                Read our philosophy
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <FalconMark className="h-56 w-56 opacity-90 md:h-72 md:w-72" strokeWidth={1} />
          </div>
        </div>
      </section>

      {/* Philosophy strip */}
      <section className="border-y border-hairline bg-slate-deep">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
          <div className="gold-rule pl-5">
            <h3 className="font-display text-lg text-ivory">
              A long horizon
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-mute">
              Compounding rewards patience above cleverness. The plan that
              survives ten market cycles will always outperform the trade
              that only survives one.
            </p>
          </div>
          <div className="gold-rule pl-5">
            <h3 className="font-display text-lg text-ivory">
              Room to be wrong
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-mute">
              Choosing badly once does not mean you have failed at this for
              good. Every serious investor has re-read their own mistakes and
              adjusted the strategy rather than the goal.
            </p>
          </div>
          <div className="gold-rule pl-5">
            <h3 className="font-display text-lg text-ivory">
              Work, then let capital work
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-mute">
              Do work that you don't need an exit from. Let your capital do
              the part of the job that buys you time back, quietly, in the
              background.
            </p>
          </div>
        </div>
      </section>

      {/* Bento dashboard */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-display text-2xl text-ivory md:text-3xl">
          Where to begin
        </h2>
        <p className="mt-3 max-w-lg font-body text-sm text-mute">
          Four ways into the same discipline — pick the one that matches
          where you are today.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3 md:grid-rows-2">
          <Link
            href="/quiz"
            className="hairline group relative flex flex-col justify-between overflow-hidden rounded-md bg-slate-panel p-8 transition-all duration-300 hover:border-champagne/40 md:col-span-2 md:row-span-2"
          >
            <div>
              <BrainCircuit className="h-7 w-7 text-champagne" strokeWidth={1.4} />
              <h3 className="mt-5 font-display text-2xl text-ivory">
                Knowledge assessment
              </h3>
              <p className="mt-3 max-w-sm font-body text-sm leading-relaxed text-mute">
                Three tiers, from compound interest to options greeks. Answer
                honestly and receive a rank that reflects where your literacy
                actually stands — not where you'd like it to stand.
              </p>
            </div>
            <span className="mt-8 font-body text-sm text-champagne">
              Begin the assessment
            </span>
          </Link>

          <Link
            href="/stocks"
            className="hairline group flex flex-col justify-between rounded-md bg-slate-panel p-7 transition-all duration-300 hover:border-champagne/40"
          >
            <TrendingUp className="h-6 w-6 text-emerald-soft" strokeWidth={1.4} />
            <div>
              <h3 className="mt-5 font-display text-xl text-ivory">
                Equities
              </h3>
              <p className="mt-2 font-body text-sm text-mute">
                Ownership, dividends, and risk-adjusted return.
              </p>
            </div>
          </Link>

          <Link
            href="/crypto"
            className="hairline group flex flex-col justify-between rounded-md bg-slate-panel p-7 transition-all duration-300 hover:border-champagne/40"
          >
            <Coins className="h-6 w-6 text-emerald-soft" strokeWidth={1.4} />
            <div>
              <h3 className="mt-5 font-display text-xl text-ivory">
                Digital assets
              </h3>
              <p className="mt-2 font-body text-sm text-mute">
                Custody, volatility, and separating signal from noise.
              </p>
            </div>
          </Link>

          <Link
            href="/about"
            className="hairline group flex flex-col justify-between rounded-md bg-slate-panel p-7 transition-all duration-300 hover:border-champagne/40 md:col-span-1"
          >
            <Compass className="h-6 w-6 text-emerald-soft" strokeWidth={1.4} />
            <div>
              <h3 className="mt-5 font-display text-xl text-ivory">
                Our philosophy
              </h3>
              <p className="mt-2 font-body text-sm text-mute">
                Why Falcon Reserve exists, and who it's for.
              </p>
            </div>
          </Link>

          <Link
            href="/community"
            className="hairline group flex flex-col justify-between rounded-md bg-slate-panel p-7 transition-all duration-300 hover:border-champagne/40 md:col-span-1"
          >
            <Users className="h-6 w-6 text-emerald-soft" strokeWidth={1.4} />
            <div>
              <h3 className="mt-5 font-display text-xl text-ivory">
                Community
              </h3>
              <p className="mt-2 font-body text-sm text-mute">
                Goals, lessons, and portfolio updates from other investors.
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
