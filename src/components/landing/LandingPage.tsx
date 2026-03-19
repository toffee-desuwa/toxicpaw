/*
 * F011 PRE-IMPLEMENTATION THINKING:
 * 1. What: Marketing-grade landing page with hero section, feature highlights,
 *    trust signals, and clear CTA. Must replace the minimal idle state.
 * 2. Decisions:
 *    - Single scroll page with sections (hero, how-it-works, features, trust)
 *    - Use CSS animations for polish (fade-in, pulse on CTA)
 *    - Keep all content static (no API calls) for instant load
 * 3. Risks: Over-engineering animations, page too long on mobile.
 *    Mitigation: Keep sections tight, max 4 feature cards.
 * 4. Simplest: Semantic sections with Tailwind, no external deps.
 * 5. Tests: Renders all sections, CTA buttons fire callbacks, accessibility.
 */

interface LandingPageProps {
  onStartScan: () => void;
  onViewHistory: () => void;
}

const features = [
  {
    icon: "📸",
    title: "Snap a Photo",
    description:
      "Point your camera at any pet food ingredient label. Our OCR reads English and Chinese labels instantly.",
  },
  {
    icon: "🔬",
    title: "AI Analysis",
    description:
      "500+ ingredients rated by veterinary nutrition science. Every ingredient flagged red, yellow, or green.",
  },
  {
    icon: "🏆",
    title: "Safety Grade",
    description:
      "Get a clear A-F grade so you know exactly how safe your pet's food is. No guesswork.",
  },
  {
    icon: "🐕",
    title: "Personalized",
    description:
      "Enter your pet's breed, age, and health conditions for tailored warnings and recommendations.",
  },
];

const steps = [
  { step: "1", label: "Scan", detail: "Take a photo of the ingredient label" },
  { step: "2", label: "Analyze", detail: "AI grades every ingredient" },
  { step: "3", label: "Know", detail: "Get your safety grade in seconds" },
];

const trustItems = [
  { stat: "500+", label: "Ingredients in database" },
  { stat: "A-F", label: "Clear safety grades" },
  { stat: "2", label: "Languages supported" },
  { stat: "Free", label: "Open source & free" },
];

export function LandingPage({ onStartScan, onViewHistory }: LandingPageProps) {
  return (
    <div className="mx-auto max-w-md px-4">
      {/* Hero Section */}
      <section className="flex min-h-[80dvh] flex-col items-center justify-center text-center">
        <div className="mb-2 text-6xl" aria-hidden="true">
          🐾
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Toxic<span className="text-red-500">Paw</span>
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-neutral-400">
          Is your pet&apos;s food safe? Scan the ingredient label and get an
          instant AI-powered safety grade.
        </p>
        <button
          onClick={onStartScan}
          className="mt-8 rounded-full bg-red-500 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-red-500/25 transition-all hover:bg-red-400 hover:shadow-red-500/40 active:scale-95"
          type="button"
          data-testid="hero-scan-button"
        >
          Scan Label Now
        </button>
        <button
          onClick={onViewHistory}
          className="mt-4 text-sm text-neutral-500 hover:text-neutral-300"
          type="button"
          data-testid="history-button"
        >
          View Scan History
        </button>
        <div className="mt-12 animate-bounce text-neutral-600" aria-hidden="true">
          ↓
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16" aria-labelledby="how-it-works-heading">
        <h2
          id="how-it-works-heading"
          className="mb-10 text-center text-2xl font-bold"
        >
          How It Works
        </h2>
        <div className="flex justify-between gap-4">
          {steps.map((s) => (
            <div key={s.step} className="flex-1 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/20 text-lg font-bold text-red-400">
                {s.step}
              </div>
              <p className="mt-3 font-semibold text-neutral-200">{s.label}</p>
              <p className="mt-1 text-xs text-neutral-500">{s.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16" aria-labelledby="features-heading">
        <h2
          id="features-heading"
          className="mb-10 text-center text-2xl font-bold"
        >
          Why ToxicPaw?
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5"
            >
              <div className="mb-2 text-2xl" aria-hidden="true">
                {f.icon}
              </div>
              <h3 className="font-semibold text-neutral-200">{f.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16" aria-labelledby="trust-heading">
        <h2
          id="trust-heading"
          className="mb-10 text-center text-2xl font-bold"
        >
          Built for Pet Parents
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {trustItems.map((t) => (
            <div
              key={t.label}
              className="rounded-xl border border-neutral-800 p-4 text-center"
            >
              <p className="text-2xl font-bold text-red-400">{t.stat}</p>
              <p className="mt-1 text-xs text-neutral-500">{t.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-bold">Ready to Scan?</h2>
        <p className="mt-2 text-sm text-neutral-500">
          Find out what&apos;s really in your pet&apos;s food.
        </p>
        <button
          onClick={onStartScan}
          className="mt-6 rounded-full bg-red-500 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-red-500/25 transition-all hover:bg-red-400 active:scale-95"
          type="button"
          data-testid="bottom-scan-button"
        >
          Scan Label Now
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8 text-center text-xs text-neutral-600">
        <p>
          ToxicPaw — Open source pet food safety scanner
        </p>
        <p className="mt-1">
          Not a substitute for veterinary advice.
        </p>
      </footer>
    </div>
  );
}
