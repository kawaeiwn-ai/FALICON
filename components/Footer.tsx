import Link from "next/link";
import FalconMark from "./FalconMark";

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-slate-deep">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <FalconMark className="h-7 w-7" />
              <span className="font-display text-base text-ivory">
                Falcon Reserve
              </span>
            </div>
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-mute">
              A record of how capital compounds over decades, not overnight.
              Built for people who plan to still be invested in twenty years.
            </p>
          </div>

          <div>
            <h3 className="font-body text-sm text-ivory">Platform</h3>
            <ul className="mt-4 space-y-2 font-body text-sm text-mute">
              <li><Link href="/stocks" className="hover:text-champagne">Equities</Link></li>
              <li><Link href="/crypto" className="hover:text-champagne">Digital assets</Link></li>
              <li><Link href="/quiz" className="hover:text-champagne">Knowledge assessment</Link></li>
              <li><Link href="/about" className="hover:text-champagne">Our philosophy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-body text-sm text-ivory">Legal</h3>
            <ul className="mt-4 space-y-2 font-body text-sm text-mute">
              <li><Link href="/disclaimer" className="hover:text-champagne">Risk disclaimer</Link></li>
              <li><Link href="/privacy" className="hover:text-champagne">Privacy policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-hairline pt-6">
          <p className="font-body text-xs leading-relaxed text-mute">
            Investing carries risk, including possible loss of principal.
            Nothing on this site is individualized financial, legal, or tax
            advice. Past performance does not guarantee future results.
            Consider your own circumstances, or consult a licensed advisor,
            before making investment decisions.
          </p>
          <p className="mt-4 font-body text-xs text-mute/70">
            © {new Date().getFullYear()} Falcon Reserve. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
