import CommunityFeed from "@/components/community/CommunityFeed";

export default function CommunityPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-body text-sm text-champagne">Community</p>
      <h1 className="mt-4 font-display text-3xl text-ivory md:text-4xl">
        Goals, lessons, and portfolio updates from other investors.
      </h1>
      <p className="mt-4 font-body text-sm leading-relaxed text-mute">
        A place to share what you're working toward and what you've learned
        along the way — not stock tips, not certainty, just other people
        thinking out loud about the same long game.
      </p>

      <div className="mt-10">
        <CommunityFeed />
      </div>
    </section>
  );
}
