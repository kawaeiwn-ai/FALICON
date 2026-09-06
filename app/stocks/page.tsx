import { Building2, LineChart, ShieldCheck, PiggyBank } from "lucide-react";

const PRINCIPLES = [
  {
    icon: Building2,
    title: "You own a piece of a business",
    body: "A share isn't a ticker that moves — it's fractional ownership of a company's future earnings, assets, and decisions. Price is what the market feels today; ownership is what you actually hold.",
  },
  {
    icon: LineChart,
    title: "Volatility is the entry fee",
    body: "Short-term price swings are the cost of admission to long-term equity returns. Investors who can sit through a 20% drawdown without changing their plan are the ones who tend to capture the following recovery.",
  },
  {
    icon: PiggyBank,
    title: "Dividends compound quietly",
    body: "Reinvested dividends have historically made up a large share of total equity returns over multi-decade periods — a slow, unglamorous engine working in the background.",
  },
  {
    icon: ShieldCheck,
    title: "Risk-adjusted, not just raw",
    body: "A 40% return from a wildly concentrated bet and a 12% return from a diversified, disciplined portfolio are not the same achievement. Judge a strategy by what it risked to get there.",
  },
];

export default function StocksPage() {
  return (
    <div>
      <section className="border-b border-hairline bg-radial-fade">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="font-body text-sm text-champagne">Equities</p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-tight text-ivory md:text-5xl">
            Ownership, patience, and the discipline to do less.
          </h1>
          <p className="mt-6 max-w-xl font-body text-sm leading-relaxed text-mute">
            Equity markets reward businesses that compound earnings over
            years — and investors who let them. Falcon Reserve treats the
            stock market as a mechanism for buying into productive
            enterprise, not a scoreboard to check every hour.
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
            A framework, not a forecast
          </h2>
          <p className="mt-4 font-body text-sm leading-relaxed text-mute">
            We won't tell you which ticker to buy this week — that kind of
            certainty doesn't exist, and anyone offering it is selling
            confidence, not analysis. What we can offer is a way of
            thinking: understand what you own, size positions to survive
            being wrong, and let time do the part of the work that no
            amount of watching the screen can speed up.
          </p>
        </div>
      </section>
    </div>
  );
}
