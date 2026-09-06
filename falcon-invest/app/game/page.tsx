import FinancialPlatformer from "@/components/game/FinancialPlatformer";

export default function GamePage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-body text-sm text-champagne">Falcon run</p>
      <h1 className="mt-4 font-display text-3xl text-ivory md:text-4xl">
        A short platforming level, built around the same three tiers as the
        assessment.
      </h1>
      <p className="mt-4 max-w-xl font-body text-sm leading-relaxed text-mute">
        Run and jump across the level, collect coins, and walk into a gold
        chest to answer a question drawn from the foundations, conduct, and
        institutional-depth tiers. A correct answer pays a coin bonus.
      </p>

      <div className="mt-10">
        <FinancialPlatformer />
      </div>
    </section>
  );
}
