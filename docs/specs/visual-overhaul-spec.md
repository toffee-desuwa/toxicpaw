# Visual Overhaul Spec (F031-F036)

## Goal

Transform ToxicPaw from "clean utility app" to "jaw-dropping experience that people screenshot and share on sight". Think: Mirofish-level visual impact.

## Tech Stack

- **Framer Motion** (animation library, pairs perfectly with React/Next.js)
- **CSS gradients + backdrop-filter** (glassmorphism effects)
- **No Three.js/WebGL** — keep it lightweight, pure CSS + Framer Motion

## Design Principles

1. **Premium, not gimmicky** — every animation should feel purposeful
2. **Dark theme with accent glows** — not flat dark, but dark with light/color accents
3. **The "wow" test** — if someone opens the page and doesn't pause, it's not enough
4. **Performance first** — animations must be 60fps, use `transform` and `opacity` only where possible
5. **Mobile-first** — all animations must work smoothly on mid-range phones

## Feature Details

### F031: Animation Infrastructure

Install framer-motion. Create reusable components in `src/components/motion/`:

```
src/components/motion/
  FadeIn.tsx        — opacity 0→1, optional y offset
  SlideUp.tsx       — translate y + fade
  ScaleIn.tsx       — scale 0→1 with spring
  StaggerList.tsx   — container that staggers children
  CountUp.tsx       — animated number counter (0 → target)
  PageTransition.tsx — AnimatePresence wrapper for route changes
  index.ts          — barrel export
```

Each component should accept: `delay`, `duration`, `className`, `children`. Use spring physics for natural feel (not linear easing).

### F032: Grade Reveal Animation

The hero moment of the app. When a grade appears (brand page load or scan complete):

1. **Grade circle**: starts scaled to 0, springs to full size with overshoot bounce
2. **Letter inside**: 3D flip from backface (Y-axis rotation 180° → 0°)
3. **Score number**: counts up from 0 to final value over ~1.5s with easing
4. **Grade label** ("优秀"/"较差"): fades in 0.3s after badge animation completes
5. **Background glow**: subtle radial gradient pulse matching grade color

Grade color reference:
- A: #10b981 (emerald green)
- B: #84cc16 (lime)
- C: #f59e0b (amber)
- D: #f97316 (orange)
- F: #dc2626 (red)

Apply to: `GradeBadge` component used in both `/brand/[slug]` and scan result.

### F033: Scan Analysis Ceremony

Replace the current "正在分析成分..." spinner with a multi-stage ceremony:

**Stage 1 — Scanning** (0-1s):
- Bright scan line sweeps top-to-bottom across the captured image
- Subtle particle/dot effect along the scan line

**Stage 2 — Extraction** (1-2s):
- Ingredient names fly out of the image one by one
- Each name is a small pill/chip that floats to center
- Stagger: 80ms between each ingredient

**Stage 3 — Analysis** (2-2.5s):
- Ingredients sort themselves: green pills float left, yellow center, red right
- Counter shows "10 safe · 3 caution · 2 harmful"

**Stage 4 — Reveal** (2.5-3.5s):
- Everything clears, grade reveals with F032 animation
- Result page content fades in below

Use framer-motion's `useAnimation` + sequence controls. Total: ~3.5s feels fast but ceremonial.

### F034: Hero Section Overhaul

**Title "ToxicPaw"**:
- Animated gradient text: background-clip text with shifting gradient (red → orange → purple → red, loop)
- CSS animation, not JS (better perf)
- Slightly larger than current, more visual weight

**Search bar**:
- Subtle glowing border (box-shadow pulse animation, 3s loop, very subtle)
- On focus: glow intensifies, border transitions to accent color
- Placeholder text has typing cursor blink effect

**Brand ranking cards**:
- Stagger animate on page load (SlideUp with 50ms stagger)
- Hover: lift (translateY -2px) + subtle glow matching grade color
- Grade badge has a tiny pulse animation on hover

**Stats section** ("500+", "A-F", etc.):
- Numbers use CountUp animation when scrolled into view (IntersectionObserver)
- Only animate once (not on every scroll)

**Overall feel**: dark background with subtle gradient noise texture, accent glows from grade colors create depth.

### F035: Share Card Visual Upgrade

Redesign the server-side generated share image (next/og ImageResponse):

**Background**:
- Dark gradient (not flat black) — e.g., #0a0a0a → #1a1a2e
- Subtle grid/dot pattern overlay for texture
- Grade-colored accent glow in corner/edge

**Card layout**:
- Grade badge: large, with colored glow/shadow
- Brand name: bold, white, prominent
- Score: large number with "/100" smaller
- Ingredient stats: icon + count in a row
- ToxicPaw branding: bottom, with subtle glow effect

**Typography**: Use system fonts that work in ImageResponse (no custom font loading issues). Bold weights for hierarchy.

Must look premium enough that people want to share it without cropping out the ToxicPaw watermark.

### F036: Global Polish

**Page transitions**:
- Wrap pages in AnimatePresence
- Enter: fade + slight slide up (opacity 0→1, y 10→0)
- Exit: fade out (opacity 1→0)
- Duration: 200ms — fast enough to feel snappy

**Buttons**:
- Active/pressed: scale(0.97) with 100ms transition
- Hover: subtle brightness increase

**Ingredient list**:
- Items stagger-animate on mount (FadeIn + SlideUp, 30ms stagger)
- Only on first render, not on every re-render

**Scroll animations**:
- Below-fold sections fade in when scrolled into view
- Use IntersectionObserver + FadeIn component
- threshold: 0.1 (trigger early)

**Search dropdown**:
- Results slide down + fade in (max-height animation or framer-motion layout)

## Testing Checklist

For each feature, Ralph must verify:
1. `npm run build` passes
2. `npm run lint` passes
3. No console errors in dev mode
4. Animations are smooth (no jank)
5. Existing functionality not broken (search, navigation, i18n, sharing)

## Important Notes

- Do NOT remove or restructure existing components. Wrap them with animation.
- Keep all existing tests passing.
- framer-motion tree-shakes well — only import what you use.
- Use `layout` prop sparingly (can cause perf issues).
- Test on mobile viewport (375px) — animations must not be too large/distracting on small screens.
- Prefer `whileInView` over manual IntersectionObserver where framer-motion supports it.
