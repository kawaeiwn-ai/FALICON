const SECTIONS = [
  {
    title: "What we collect",
    body: "We collect the information you give us directly — such as an email address if you sign up for updates — and basic usage data like which pages are viewed and which browser is used, gathered through standard analytics.",
  },
  {
    title: "How it's used",
    body: "Usage data helps us understand which content is useful and where the platform breaks. Any contact information you provide is used only to communicate with you, and never sold to third parties.",
  },
  {
    title: "Storage and protection",
    body: "Data is stored with industry-standard encryption at rest and in transit, access is limited to systems that need it to function, and we do not retain data longer than necessary for the purpose it was collected for.",
  },
  {
    title: "Your choices",
    body: "You can request a copy of the data associated with your account, ask us to delete it, or unsubscribe from any communication at any time. Requests are handled without requiring an explanation.",
  },
  {
    title: "Cookies",
    body: "We use essential cookies to keep the site functional, and optional analytics cookies to understand aggregate usage patterns. You can disable non-essential cookies in your browser settings without losing access to core content.",
  },
];

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <p className="font-body text-sm text-champagne">Legal</p>
      <h1 className="mt-4 font-display text-4xl text-ivory">
        Privacy policy
      </h1>
      <p className="mt-5 font-body text-sm leading-relaxed text-mute">
        Falcon Reserve is a financial education platform. This policy
        explains, in plain terms, what information we collect and how it is
        handled.
      </p>

      <div className="mt-12 space-y-10">
        {SECTIONS.map((section) => (
          <div key={section.title} className="gold-rule pl-5">
            <h2 className="font-display text-xl text-ivory">
              {section.title}
            </h2>
            <p className="mt-3 font-body text-sm leading-relaxed text-mute">
              {section.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
