# ToxicPaw 🐾

**Open-source pet food safety analyzer with a 500+ ingredient database.**

Scan a pet food label → get an instant A-F safety grade with every ingredient flagged.

<!-- TODO: Replace with actual GIF of scan→grade flow -->
<!-- ![ToxicPaw Demo](docs/assets/demo.gif) -->

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-385_passing-brightgreen)](src/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## Why ToxicPaw?

Most pet owners can't decode ingredient labels. "Chicken by-product meal", "BHA", "menadione sodium bisulfite" — what do these mean? Is this food safe?

ToxicPaw answers that question instantly. Point your camera at a label, and the app:

1. **Extracts** ingredients via OCR (English + Chinese labels)
2. **Matches** each ingredient against a curated 512-ingredient knowledge base
3. **Scores** the food on a 100-point scale with an A-F letter grade
4. **Explains** the result in plain language via Claude AI

No signup. No paywall. Works offline (except AI explanations).

## Features

| Feature | Description |
|---------|-------------|
| **Camera Scan** | Point, shoot, analyze — 3 taps to a grade |
| **512 Ingredients** | Curated database with safety ratings, categories, and bilingual names |
| **75 Pre-Analyzed Brands** | Orijen, Royal Canin, 皇家, 渴望, 伯纳天纯 — 48 brands ready to browse |
| **A-F Grading** | 100-point scoring with harmful penalties, protein bonuses, filler detection |
| **Brand Rankings** | Sortable leaderboard — "which cat food is safest?" answered instantly |
| **Pet Profiles** | Breed-specific warnings (e.g., grain sensitivity for certain breeds) |
| **AI Explanations** | Claude-powered plain-language breakdown of why a food scored the way it did |
| **Scan History** | Save, compare two foods side by side |
| **Social Sharing** | Screenshot-ready result cards for social media |
| **Bilingual** | Full Chinese (中文) + English UI with language toggle |
| **PWA** | Installable, mobile-first, works as a standalone app |

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 + React 19 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 (mobile-first, dark theme) |
| Font | MiSans (Xiaomi open-source) |
| OCR | Tesseract.js (client-side, eng + chi_sim) |
| AI | Claude API (ingredient explanations) |
| Data | 512 ingredients + 75 brand products (JSON) |
| Testing | Jest + React Testing Library (385 tests) |
| Deployment | Vercel / Docker (standalone output) |

## Quick Start

```bash
git clone https://github.com/your-username/toxicpaw.git
cd toxicpaw
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). That's it — no API key required for core functionality.

### Optional: AI Explanations

```bash
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
```

Without this, everything works — AI explanations are simply skipped.

## Architecture

```
src/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Homepage (demo-first with brand data)
│   ├── useAppState.ts          # App state machine (scan → analyze → result)
│   ├── brand/[slug]/           # 75 pre-rendered brand pages (SSG)
│   ├── ranking/                # Brand safety leaderboard
│   └── api/explain/            # Claude AI explanation endpoint
│
├── components/
│   ├── scanner/                # Camera capture + image upload + preview
│   ├── analysis/               # Grade badge, ingredient list, summary bar
│   ├── brand/                  # Brand search + brand result pages
│   ├── landing/                # Demo-first homepage
│   ├── history/                # Scan history + side-by-side comparison
│   ├── sharing/                # Social sharing card + image generation
│   ├── profile/                # Pet profile form (breed, age, conditions)
│   ├── i18n/                   # Language switcher (EN/中文)
│   └── grade/                  # Grade badge component
│
├── lib/
│   ├── knowledge/              # Ingredient database loader + fuzzy matcher
│   ├── analyzer/               # 100-point scoring engine (A-F grading)
│   ├── ocr/                    # Tesseract.js pipeline + ingredient parser
│   ├── brands/                 # Brand database loader + search
│   ├── explainer/              # Claude AI explanation generator + cache
│   ├── i18n/                   # I18nProvider, useTranslation, locale detection
│   ├── profile/                # Pet profile + breed sensitivities
│   └── history/                # localStorage-based scan persistence
│
data/
├── ingredients.json            # 512 ingredients, 17 categories, bilingual
└── brands.json                 # 75 products from 48 brands (dog + cat)
```

## Grading System

ToxicPaw scores food on a 100-point scale:

| Grade | Score | Meaning |
|-------|-------|---------|
| **A** | 90–100 | Excellent — high-quality, whole-food ingredients |
| **B** | 75–89 | Good — minor concerns only |
| **C** | 60–74 | Fair — some questionable ingredients |
| **D** | 40–59 | Poor — multiple concerning ingredients |
| **F** | 0–39 | Fail — significant safety concerns |

**Scoring details:**
- Harmful ingredients: **-15 points** each (reduced to -10 if not in first 3 positions)
- Caution ingredients: **-5 points** each
- Protein as first ingredient: **+5 bonus**
- No protein in top 3: **-10 penalty**
- Concern categories (fillers, by-products, artificial additives): **-3 each**

## Knowledge Base

The ingredient database (`data/ingredients.json`) is the core of ToxicPaw:

- **512 ingredients** across 17 categories
- **420 safe** / **61 caution** / **31 harmful** ratings
- Every ingredient has: name, Chinese aliases, category, safety rating, explanation
- Sources: AAFCO standards, veterinary nutrition literature
- Fuzzy matching handles OCR artifacts, hyphens, plurals, "X Supplement" patterns

The brand database (`data/brands.json`) includes **75 products** from **48 brands**:
- Premium: Orijen, Acana, Ziwi Peak, K9 Natural
- Mid-tier: Royal Canin, Hill's, Purina Pro Plan
- Budget: Meow Mix, Friskies, Pedigree
- Chinese domestic: 伯纳天纯, 网易严选, 疯狂小狗, 麦富迪, 高爷家

All ingredient lists sourced from real product packaging.

## Commands

```bash
npm run dev       # Dev server at localhost:3000
npm run build     # Production build (81 static pages)
npm test          # Run 385 tests
npm run lint      # ESLint check
```

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

**High-impact areas:**
- **Ingredient database** — add missing ingredients, improve descriptions
- **Brand coverage** — add more brands with real ingredient lists
- **Breed sensitivities** — expand breed-specific health data
- **Translations** — improve Chinese translations, add more languages
- **OCR accuracy** — better parsing for unusual label formats

## Docker

```bash
docker build -t toxicpaw .
docker run -p 3000:3000 toxicpaw
```

## License

[MIT](LICENSE)

---

Built for pets. Open for everyone.
