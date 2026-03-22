# ToxicPaw Launch Phase Design Spec

> Shared design decisions for F013-F026. Every session MUST read this before coding.
> DO NOT modify this file. If a decision conflicts with your instinct, follow this spec.

## Typography & Visual

- **Font**: MiSans (Xiaomi open-source). Load via `@font-face` with self-hosted woff2 files in `public/fonts/`. Fallback: `system-ui, -apple-system, sans-serif`.
- **Dark mode**: Keep existing dark theme (`bg-neutral-950`, `text-neutral-100`). Do NOT add light mode.
- **Grade colors**: A=emerald-500, B=lime-500, C=amber-500, D=orange-500, F=red-500. These are already established — do not change.
- **Screenshot standard**: Every screen must look good at 375×812 (iPhone SE/13 mini). Test by checking that no text is clipped, no horizontal scroll, no awkward whitespace.

## Brand Database (F014)

- **File**: `data/brands.json`
- **Schema per entry**:
  ```json
  {
    "slug": "royal-canin-indoor-cat",
    "brand": "Royal Canin",
    "brandCn": "皇家",
    "product": "Indoor Adult Cat",
    "productCn": "室内成猫粮",
    "petType": "cat",
    "ingredients": ["chicken meal", "corn", "wheat", ...],
    "source": "packaging / official website URL"
  }
  ```
- **Analysis results are NOT stored** — they are computed at build time by running each brand's ingredients through the existing `analyzeIngredients()` engine. This ensures consistency if the scoring algorithm changes.
- **Target: 50-100 brands** covering:
  - International premium: Orijen, Acana, Ziwi Peak, Wellness, Blue Buffalo
  - International mid-tier: Royal Canin, Hill's, Purina Pro Plan
  - International budget: Purina ONE, Meow Mix, Friskies
  - Chinese domestic: 伯纳天纯, 网易严选, 疯狂小狗, 麦富迪, 比瑞吉, 卫仕
  - Mix of cat + dog, aiming for ~50/50 split
- **Ingredient lists must be real** — sourced from actual product packaging or official brand websites. Do NOT fabricate ingredient lists.

## Brand Pages (F015)

- **Route**: `/brand/[slug]` using Next.js dynamic routes
- **Static generation**: Use `generateStaticParams()` to pre-render all brand pages at build time
- **Layout**: Reuse existing `AnalysisView` component but add:
  - Brand name + product line header
  - "Scan your own food" CTA button at bottom
  - Link back to ranking page
- **SEO**: Each page gets unique `<title>` and `<meta description>` with brand name + grade

## Ranking Page (F016)

- **Route**: `/ranking`
- **Layout**: Card list sorted by grade (A first, F last). Each card shows: grade badge (small), brand name, product name, score.
- **Filters**: Pet type tabs (All / Cat / Dog). No other filters needed for v1.
- **This page is linkbait** — title should be "Pet Food Safety Rankings | ToxicPaw" / "宠物粮安全排行榜"

## Homepage Redesign (F017)

- **Replace current LandingPage component entirely**
- **First screen (above fold)**:
  1. ToxicPaw logo + tagline (one line)
  2. Search bar: "Search a brand..." with instant filter
  3. Top 5 worst-rated brands (the fear hook)
  4. Top 5 best-rated brands
  5. "Or scan your own label" secondary CTA
- **Below fold**: Brief feature highlights (keep concise), trust signals
- **Key principle**: User gets VALUE in 3 seconds without clicking anything

## i18n (F019)

- **Approach**: Client-side React Context + JSON translation files. NO route prefix, NO next-intl, NO middleware. Just string replacement.
- **Why not next-intl**: Chinese traffic comes from social media (小红书/抖音), not Baidu search. Route-level i18n is massive refactor for zero launch-stage benefit. Can migrate later if Baidu SEO becomes relevant.
- **Implementation**: `src/lib/i18n/` with `I18nProvider` context, `useTranslation` hook, `messages/en.json` + `messages/zh.json`
- **Supported locales**: `en`, `zh`
- **Default**: Detect from `navigator.language`. Fallback to `en`. Save preference to localStorage.
- **Chinese ingredient names**: Already in knowledge base as aliases — display Chinese name first when locale is `zh`
- **Language switcher**: Simple toggle button in header/footer (EN / 中文)

## Zero-Friction Flow (F020)

- **Current flow**: Landing → Profile → Scanner → Result
- **New flow**: Landing → Scanner → Result → (optional) "Personalize with pet profile"
- **Profile button**: Show on result page as "Get personalized warnings for your pet" link
- **Profile data**: Still saved to localStorage, still affects scoring when present
- **Key**: First-time user does NOT see profile form unless they choose to

## Knowledge Base Updates (F021)

- **Add generic terms**: "Artificial Colors", "Artificial Flavors", "Animal By-Products", "Meat Meal" (generic), "Poultry By-Product Meal"
- **Fuzzy matching improvements**: Handle OCR artifacts (extra spaces, hyphens vs spaces, case), handle "by-product" vs "byproduct", handle partial matches
- **Goal**: Reduce unknown/gray items to <5% on typical real-world labels

## Share Images (F025)

- **Use Next.js `ImageResponse` (next/og)** for server-side OG image generation
- **Per-brand OG image**: Shows grade badge + brand name + "X harmful ingredients found" + ToxicPaw branding
- **Style**: Dark background matching app theme, large grade letter, brand name prominent
- **Size**: 1200×630 for OG, also generate 1080×1080 square variant for 小红书/Instagram
