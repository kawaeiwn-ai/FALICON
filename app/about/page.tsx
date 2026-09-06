import FalconMark from "@/components/FalconMark";

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-hairline bg-radial-fade">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="font-body text-sm text-champagne">Our philosophy</p>
            <h1 className="mt-4 font-display text-4xl leading-tight text-ivory md:text-5xl">
              A falcon doesn't chase everything that moves.
            </h1>
            <p className="mt-6 max-w-xl font-body text-sm leading-relaxed text-mute">
              It watches from height, waits for the moment that's actually
              worth the dive, and commits fully when it does. That's the
              posture we try to build in every investor who spends time
              here — patient observation, followed by decisive, well-sized
              action, rather than a reaction to every twitch in the market.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <FalconMark className="h-40 w-40" strokeWidth={1} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="font-display text-2xl text-ivory">
          Why long-term, on purpose
        </h2>
        <p className="mt-4 font-body text-sm leading-relaxed text-mute">
          Real investing plays out over ten to twenty years, aimed at
          building genuine security — not a bet on where a price lands
          overnight. That's the line we draw between investing and
          gambling: not the asset class, not the size of the position, but
          the horizon and the reasoning behind it.
        </p>

        <h2 className="mt-14 font-display text-2xl text-ivory">
          A wrong turn isn't the end of the road
        </h2>
        <p className="mt-4 font-body text-sm leading-relaxed text-mute">
          Choosing badly in the markets doesn't mean you've failed at this
          for good. It means you learn what the mistake was actually
          teaching you, adjust the strategy, and choose a new path forward.
          Every investor worth listening to has a mistake they still think
          about.
        </p>

        <h2 className="mt-14 font-display text-2xl text-ivory">
          Work you like, capital that works for you
        </h2>
        <p className="mt-4 font-body text-sm leading-relaxed text-mute">
          The healthiest version of this looks like doing work that
          actually satisfies you, while your capital handles the part of
          the job that quietly buys back your time. Money isn't the finish
          line here — the freedom it can eventually purchase is.
        </p>

        <h2 className="mt-14 font-display text-2xl text-ivory">
          Borrowed wisdom, held loosely
        </h2>
        <p className="mt-4 font-body text-sm leading-relaxed text-mute">
          Ideas like compounding, risk-adjusted return, and market
          psychology didn't originate with us, and we don't present them as
          if they did. We try to hold several perspectives at once rather
          than pushing a single house view — the goal is a well-rounded
          investor, not a follower.
        </p>
      </section>
    </div>
  );
}
