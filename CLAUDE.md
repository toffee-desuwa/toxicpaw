# ToxicPaw

AI-powered pet food ingredient scanner. Scan a pet food label, get an instant safety grade.

## What This Project Does

A mobile-first web app where users photograph or upload a pet food ingredient label. OCR extracts the text, AI analyzes every ingredient against a comprehensive knowledge base, and outputs: a letter grade (A-F), red-flagged harmful ingredients, green-flagged quality ingredients, a plain-language explanation of why the food is good or bad. Optional: enter pet breed/age/weight for personalized recommendations.

## Tech Stack

- **Frontend**: Next.js 15 + React 19 + TypeScript (mobile-first PWA)
- **OCR**: Tesseract.js (client-side) or Claude Vision API
- **AI Analysis**: Claude API for ingredient analysis and explanation generation
- **Knowledge Base**: JSON/SQLite database of 500+ pet food ingredients with safety ratings
- **Styling**: Tailwind CSS v4 (mobile-first design)
- **Camera**: Web Camera API for direct photo capture

## Project Structure

```
toxicpaw/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── scanner/      # Camera + OCR components
│   │   ├── analysis/     # Ingredient analysis display
│   │   ├── grade/        # Grade badge (A-F) component
│   │   └── profile/      # Pet profile input
│   ├── lib/              # Shared utilities
│   │   ├── ocr/          # OCR processing
│   │   ├── analyzer/     # Ingredient analysis engine
│   │   └── knowledge/    # Ingredient knowledge base
│   └── api/              # API route handlers
├── data/
│   └── ingredients.json  # Master ingredient knowledge base
├── public/               # Static assets + PWA manifest
├── features.json         # Feature tracking (harness - DO NOT DELETE)
├── progress.txt          # Session progress log (harness - DO NOT DELETE)
└── init.sh               # Environment init script (harness - DO NOT DELETE)
```

## Commands

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # Jest + React Testing Library
npm run lint         # ESLint
npm run build        # Production build
```

## Harness Files (DO NOT DELETE OR MODIFY STRUCTURE)

- `features.json` - Tracks all features and their completion status. Agent must update status after completing each feature. NEVER remove entries.
- `progress.txt` - Append-only log of what each session accomplished. Write a summary at the end of each session.
- `init.sh` - Run at the start of each session to verify environment.

## Session Protocol

Each Ralph loop is a FRESH session. At the start of every session:
1. Run `bash init.sh` to verify environment
2. Read `progress.txt` to understand what previous sessions did
3. Read `features.json` to find the highest-priority incomplete feature
4. Work on ONE feature per session
5. When done:
   - Update feature status in `features.json` to "done"
   - `git add` and `git commit` with descriptive message
   - Append what you did to `progress.txt`
