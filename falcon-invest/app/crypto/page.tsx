import { KeyRound, Waves, AlertTriangle, Network } from "lucide-react";

const PRINCIPLES = [
  {
    icon: KeyRound,
    title: "Custody is a decision, not a default",
    body: "Holding your own keys means holding your own responsibility. Understand the trade-off between self-custody and an exchange before you decide where your assets live.",
  },
  {
    icon: Waves,
    title: "Liquidity determines what a price even means",
    body: "A thinly traded token's 'price' can move on a single order. Depth of liquidity is what separates a real market from a number that only exists until someone tries to sell into it.",
  },
  {
    icon: Network,
    title: "Read the protocol, not the price chart",
    body: "What does the network actually do, who uses it, and does the token capture any of that usage? A chart tells you sentiment; the protocol tells you whether the sentiment is attached to anything.",
  },
  {
    icon: AlertTriangle,
    title: "Hype cycles are a recurring feature, not a bug",
    body: "Every cycle produces new stories designed to create urgency. The discipline is the same one that applies to equities: position size to your conviction and your ability to be wrong, not to the loudest voice in the room.",
  },
];

export default function CryptoPage() {
  return (
    <div>
      <section className="border-b border-hairline bg-radial-fade">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-body text-sm text-champagne">Digital assets</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-tight text-ivory md:text-5xl">
            Web3 wealth, without the mythology.
          </h1>
          <p className="mt-6 max-w-xl font-body text-sm leading-relaxed text-mute">
            Digital assets sit at the more volatile end of a long-term
            portfolio, not outside the discipline that governs the rest of
            it. The same questions about liquidity, custody, and conviction
            still apply — they just move faster here.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {PRINCIPLES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="hairline rounded-md bg-slate-panel p-7">
              <Icon className="h-6 w-6 text-champagne" strokeWidth={1.4} />
              <h3 className="mt-5 font-display text-xl text-ivory">{title}</h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-mute">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-hairline bg-slate-deep">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="font-display text-2xl text-ivory">
            Recognizing a rug before you're standing on it
          </h2>
          <p className="mt-4 font-body text-sm leading-relaxed text-mute">
            Anonymous teams, liquidity locked for suspiciously short periods,
            and returns promised on a fixed schedule are recurring patterns
            across nearly every rug pull on record. None of them guarantee
            fraud on their own, but stacked together they're reason enough to
            walk away before committing real capital. Curiosity is free;
            capital isn't.
          </p>
        </div>
      </section>
    </div>
  );
}
