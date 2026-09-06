import { AlertTriangle } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <div className="hairline flex items-start gap-4 rounded-md bg-slate-panel p-6">
        <AlertTriangle className="mt-1 h-6 w-6 shrink-0 text-champagne" strokeWidth={1.6} />
        <p className="font-body text-sm leading-relaxed text-ivory">
          Investing มีความเสี่ยง ผู้ลงทุนควรศึกษาข้อมูลก่อนตัดสินใจลงทุน. All
          investing involves risk, including the possible loss of principal.
        </p>
      </div>

      <h1 className="mt-12 font-display text-4xl text-ivory">
        Risk disclaimer
      </h1>

      <div className="mt-8 space-y-8 font-body text-sm leading-relaxed text-mute">
        <p>
          Falcon Reserve is an educational platform. Nothing published here —
          including the philosophy content, the equities and digital asset
          overviews, or the knowledge assessment — constitutes individualized
          financial, legal, tax, or investment advice. It is general
          information intended to build understanding, not a recommendation
          to buy, sell, or hold any specific asset.
        </p>
        <p>
          Markets carry inherent risk. The value of stocks, funds, and
          digital assets can fall as well as rise, and you may receive back
          less than you originally invested. Digital assets in particular
          are subject to high volatility, evolving regulation, and, in some
          cases, limited liquidity.
        </p>
        <p>
          Past performance — of an asset, a strategy, or a market cycle — is
          not a reliable indicator of future results. Any historical
          patterns referenced on this site (such as long-term equity trends)
          describe what has happened, not a guarantee of what will happen
          next.
        </p>
        <p>
          Before making any investment decision, consider your own financial
          situation, objectives, and risk tolerance, and consider consulting
          a licensed financial advisor, accountant, or legal professional in
          your jurisdiction.
        </p>
        <p>
          Falcon Reserve and its contributors accept no liability for losses
          incurred as a result of decisions made based on content found on
          this platform.
        </p>
      </div>
    </section>
  );
}
