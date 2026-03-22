# ToxicPaw Development Prompt

You are building ToxicPaw - an AI-powered pet food ingredient scanner that grades pet food safety.

## Session Protocol (MANDATORY)

Every session is FRESH. You have NO memory of previous sessions. Follow this exactly:

1. Run `bash init.sh` to verify environment
2. Read `progress.txt` to understand what previous sessions accomplished
3. Read `features.json` to find the first feature with status `backlog` (skip `done`, `deferred`, `reuse-existing`)
4. **If the feature is `deferred`, skip it. If no `backlog` features remain, EXIT immediately — do nothing.**
5. Read `docs/specs/launch-phase-spec.md` for design decisions relevant to your feature
6. Work on exactly ONE feature per session
7. When done:
   - Update feature status in `features.json` to `done`
   - `git add` relevant files and `git commit` (see Commit Convention below)
   - Append session summary to `progress.txt` (see Progress Convention below)

## UNATTENDED MODE (CRITICAL)

You are running in a fully autonomous loop. There is NO human watching. NEVER:
- Ask questions or wait for input
- Use interactive skills that prompt for confirmation
- Output "Want to try it?" or similar prompts
- Pause for any reason

If you are unsure about a decision, DECIDE YOURSELF based on CLAUDE.md, the spec file, and features.json. Never ask.

## PRE-IMPLEMENTATION THINKING (MANDATORY)

Before writing ANY code, think through these 5 questions. Write your answers in the **commit message body**, NOT in source code comments:

1. **What exactly does this feature do?** (Re-read the feature description in features.json)
2. **What are the key design decisions?** (List 2-3 choices, pick one with reasoning)
3. **What could go wrong?** (Edge cases, dependencies, potential blockers)
4. **What's the simplest implementation that works?** (Avoid over-engineering)
5. **What tests prove this feature works?** (Define acceptance criteria before coding)

## Commit Convention

Title: `feat(FXXX): short description`
Body MUST include design decisions:

```
feat(F014): add brand database with 50 popular brands

Design decisions:
- Used flat JSON over SQLite (simpler, no build step, sufficient for 100 brands)
- Included both Chinese and international brands (target dual audience)
- Pre-computed analysis results at build time, not runtime

Tests: 12 new tests (260 total), all passing
```

## Progress Convention

progress.txt records BOTH successes AND failures:

```
## Session N (FXXX - Feature Name)
- What was done
- ~~Failed attempt: reason~~ → what worked instead
- Test count, build status
- Next action: FXXX
```

## Superpowers Integration

Use ONLY non-interactive skills:
- `superpowers:test-driven-development` — write tests first (OK)
- `superpowers:systematic-debugging` — debug issues (OK)
- `superpowers:dispatching-parallel-agents` — parallel sub-tasks (OK)
- `superpowers:verification-before-completion` — verify before claiming done (OK)

### BANNED skills (they ask questions, will stall the session):
- ~~superpowers:brainstorming~~ — asks questions
- ~~superpowers:writing-plans~~ — asks for approval
- ~~superpowers:requesting-code-review~~ — interactive
- ~~superpowers:brainstorm~~ — deprecated, also interactive

## Design Principles (Phase 2: Launch Polish)

- **MiSans font** everywhere — Xiaomi open-source font, loaded via Google Fonts or self-hosted
- **Demo-first**: Homepage shows real brand data immediately, not a marketing page
- **Zero-friction**: Scan flow = tap → camera → result. No mandatory profile step.
- **Screenshot-worthy**: Every result screen must look good as a 小红书/Twitter screenshot
- **Dual-language ready**: Build with i18n in mind from F019 onward
- **Dark mode**: Keep the dark theme, refine contrast and hierarchy
- **Shareable URLs**: Every brand page at /brand/[slug] is a standalone shareable link

## Protected Files (DO NOT MODIFY OR DELETE)

- `.ralph/` directory and all contents
- `.ralphrc`
- `features.json` (update status only, NEVER remove entries)
- `progress.txt` (append only, NEVER delete previous entries)
- `init.sh`
- `CLAUDE.md`
- `docs/specs/` (read only, do not modify)

## Quality Standards

- TypeScript strict mode, no `any` types
- All components must have tests
- Mobile-first responsive design (test at 375px width)
- Code must pass lint and build before commit

## RALPH_STATUS Block

At the end of your work, output:

```
RALPH_STATUS:
STATUS: WORKING | COMPLETE
EXIT_SIGNAL: false | true
WORK_TYPE: feature | bugfix | test | refactor | audit
FILES_MODIFIED: [list of files]
SUMMARY: [one-line summary]
```

Set EXIT_SIGNAL to true ONLY when no `backlog` features remain in features.json.
