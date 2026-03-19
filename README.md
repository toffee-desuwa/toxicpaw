# ToxicPaw

> AI-powered pet food ingredient scanner. Scan a label, get an instant safety grade.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## What It Does

ToxicPaw helps pet owners make informed choices about pet food. Point your camera at any ingredient label and get:

- **A-F Safety Grade** -- An instant, color-coded letter grade based on ingredient analysis
- **Ingredient Flags** -- Every ingredient flagged red (harmful), yellow (caution), or green (safe)
- **AI Explanations** -- Plain-language breakdown of why the food scored the way it did
- **Personalized Warnings** -- Tailored alerts based on your pet's breed, age, and health conditions
- **Scan History** -- Save and compare past scans side by side
- **Social Sharing** -- Share results as image cards on social media

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript (strict) |
| Styling | Tailwind CSS v4 (mobile-first) |
| OCR | Tesseract.js (client-side, English + Chinese) |
| AI | Claude API for ingredient explanations |
| Data | 500+ ingredient knowledge base with safety ratings |
| Testing | Jest + React Testing Library |

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
# Clone the repo
git clone https://github.com/your-username/toxicpaw.git
cd toxicpaw

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your phone or browser.

### Environment Variables (Optional)

For AI-powered explanations, add your Anthropic API key:

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
```

The app works fully without an API key -- AI explanations are simply skipped.

## Usage

1. **Scan** -- Tap "Scan Label Now" and photograph the ingredient list on any pet food package
2. **Review** -- See your grade (A-F) with every ingredient color-coded
3. **Personalize** -- Add your pet's profile for breed-specific warnings
4. **Compare** -- Save scans and compare two foods side by side
5. **Share** -- Generate a shareable image card of your results

## Project Structure

```
src/
├── app/                  # Next.js app router
├── components/
│   ├── analysis/         # Result display (grade, ingredients, summary)
│   ├── grade/            # Grade badge component
│   ├── history/          # Scan history & comparison
│   ├── landing/          # Marketing landing page
│   ├── profile/          # Pet profile form
│   ├── scanner/          # Camera capture & image upload
│   └── sharing/          # Social sharing cards
├── lib/
│   ├── analyzer/         # Scoring engine (A-F grading)
│   ├── explainer/        # Claude AI explanation generator
│   ├── history/          # localStorage persistence
│   ├── knowledge/        # 500+ ingredient database
│   ├── ocr/              # Tesseract.js OCR pipeline
│   └── profile/          # Pet profile & sensitivities
data/
└── ingredients.json      # Master ingredient knowledge base
```

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm test          # Run all tests
npm run lint      # ESLint check
```

## Ingredient Knowledge Base

The knowledge base (`data/ingredients.json`) contains 500+ pet food ingredients, each with:

- **Name** and common aliases (English + Chinese)
- **Category** (protein, grain, preservative, filler, etc.)
- **Safety rating** (safe, caution, harmful)
- **Explanation** of why it's rated that way

Sources: AAFCO standards, veterinary nutrition literature.

## How Grading Works

ToxicPaw uses a 100-point scoring system:

| Grade | Score | Meaning |
|-------|-------|---------|
| A | 90-100 | Excellent -- high-quality ingredients |
| B | 75-89 | Good -- minor concerns |
| C | 60-74 | Fair -- some questionable ingredients |
| D | 40-59 | Poor -- multiple concerning ingredients |
| F | 0-39 | Fail -- significant safety concerns |

Penalties apply for harmful ingredients, fillers, and artificial additives. Bonuses for protein as the first ingredient.

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Key areas where help is needed:
- Expanding the ingredient knowledge base
- Adding more languages for OCR
- Improving breed-specific sensitivity data

## License

MIT -- see [LICENSE](LICENSE) for details.

---

Built with care for pets everywhere.
