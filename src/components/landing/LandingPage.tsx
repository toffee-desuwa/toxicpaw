/**
 * F011 - Landing Page (polished F013)
 *
 * Marketing-grade landing page with MiSans typography, refined spacing,
 * and screenshot-worthy visual hierarchy on dark theme.
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
      <section className="flex min-h-[85dvh] flex-col items-center justify-center text-center">
        <div className="mb-3 text-6xl" aria-hidden="true">
          🐾
        </div>
        <h1 className="text-5xl font-black tracking-tight">
          Toxic<span className="text-red-500">Paw</span>
        </h1>
        <p className="mt-5 max-w-xs text-lg leading-relaxed text-neutral-400">
          Is your pet&apos;s food safe? Scan the ingredient label and get an
          instant AI-powered safety grade.
        </p>
        <button
          onClick={onStartScan}
          className="mt-10 rounded-full bg-red-500 px-12 py-4 text-lg font-bold text-white shadow-xl shadow-red-500/25 transition-all hover:bg-red-400 hover:shadow-red-500/40 active:scale-[0.97]"
          type="button"
          data-testid="hero-scan-button"
        >
          Scan Label Now
        </button>
        <button
          onClick={onViewHistory}
          className="mt-4 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-300"
          type="button"
          data-testid="history-button"
        >
          View Scan History
        </button>
        <div className="mt-16 animate-bounce text-neutral-700" aria-hidden="true">
          ↓
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20" aria-labelledby="how-it-works-heading">
        <h2
          id="how-it-works-heading"
          className="mb-12 text-center text-2xl font-bold tracking-tight"
        >
          How It Works
        </h2>
        <div className="flex justify-between gap-4">
          {steps.map((s) => (
            <div key={s.step} className="flex-1 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-lg font-bold text-red-400">
                {s.step}
              </div>
              <p className="mt-4 font-semibold text-neutral-100">{s.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                {s.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20" aria-labelledby="features-heading">
        <h2
          id="features-heading"
          className="mb-12 text-center text-2xl font-bold tracking-tight"
        >
          Why ToxicPaw?
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5"
            >
              <div className="mb-3 text-2xl" aria-hidden="true">
                {f.icon}
              </div>
              <h3 className="font-bold text-neutral-100">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-neutral-400">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-20" aria-labelledby="trust-heading">
        <h2
          id="trust-heading"
          className="mb-12 text-center text-2xl font-bold tracking-tight"
        >
          Built for Pet Parents
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {trustItems.map((t) => (
            <div
              key={t.label}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 text-center"
            >
              <p className="text-2xl font-bold text-red-400">{t.stat}</p>
              <p className="mt-1.5 text-xs font-medium text-neutral-500">
                {t.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 text-center">
        <h2 className="text-2xl font-bold tracking-tight">Ready to Scan?</h2>
        <p className="mt-3 text-sm text-neutral-500">
          Find out what&apos;s really in your pet&apos;s food.
        </p>
        <button
          onClick={onStartScan}
          className="mt-8 rounded-full bg-red-500 px-12 py-4 text-lg font-bold text-white shadow-xl shadow-red-500/25 transition-all hover:bg-red-400 active:scale-[0.97]"
          type="button"
          data-testid="bottom-scan-button"
        >
          Scan Label Now
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800/50 py-10 text-center text-xs text-neutral-600">
        <p className="font-medium">
          ToxicPaw — Open source pet food safety scanner
        </p>
        <p className="mt-1.5">
          Not a substitute for veterinary advice.
        </p>
      </footer>
    </div>
  );
}
