import Runner3DGameLoader from "@/components/game/Runner3DGameLoader";

export default function RunnerPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <p className="font-body text-sm text-champagne">Falcon dash</p>
      <h1 className="mt-4 font-display text-3xl text-ivory md:text-4xl">
        A 3D endless run through the same three tiers of literacy.
      </h1>
      <p className="mt-4 max-w-xl font-body text-sm leading-relaxed text-mute">
        Switch lanes, jump, and slide to stay ahead of the track. Reaching a
        question sign pauses the run — answer correctly for a speed boost and
        bonus coins, or take a speed penalty and keep going.
      </p>

      <div className="mt-10">
        <Runner3DGameLoader />
      </div>
    </section>
  );
}
