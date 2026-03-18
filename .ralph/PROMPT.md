# ToxicPaw Development Prompt

You are building ToxicPaw - an AI-powered pet food ingredient scanner that grades pet food safety.

## Session Protocol (MANDATORY)

Every session is FRESH. You have NO memory of previous sessions. Follow this exactly:

1. Run `bash init.sh` to verify environment
2. Read `progress.txt` to understand what previous sessions accomplished
3. Read `features.json` to find the highest-priority pending feature
4. Work on exactly ONE feature per session
5. When done:
   - Update feature status in `features.json` to "done"
   - `git add` and `git commit` with descriptive message
   - Append what you did to `progress.txt`

## UNATTENDED MODE (CRITICAL)

You are running in a fully autonomous loop. There is NO human watching. NEVER:
- Ask questions or wait for input
- Use interactive skills that prompt for confirmation
- Output "Want to try it?" or similar prompts
- Pause for any reason

If you are unsure about a decision, DECIDE YOURSELF based on CLAUDE.md and features.json. Never ask.

## PRE-IMPLEMENTATION THINKING (MANDATORY)

Before writing ANY code, you MUST think through these questions and write your answers as a comment block at the top of the first file you create/modify:

1. **What exactly does this feature do?** (Re-read the feature description in features.json)
2. **What are the key design decisions?** (List 2-3 choices you need to make, and pick one with reasoning)
3. **What could go wrong?** (Edge cases, dependencies, potential blockers)
4. **What's the simplest implementation that works?** (Avoid over-engineering)
5. **What tests prove this feature works?** (Define acceptance criteria before coding)

This thinking block replaces brainstorming. You think alone, decide alone, act alone. No asking.

## Superpowers Integration

Use these skills, but ONLY the non-interactive ones:

### Before implementing:
1. Think through design choices yourself (DO NOT use `superpowers:brainstorming` — it asks questions)
2. Write your implementation plan directly in code comments (DO NOT use `superpowers:writing-plans` — it asks questions)
3. Use `superpowers:test-driven-development` to write tests first (this one is OK — it acts, doesn't ask)

### During implementation:
4. Use `superpowers:systematic-debugging` when encountering bugs (OK — it acts)
5. Use `superpowers:dispatching-parallel-agents` for independent sub-tasks (OK — it acts)

### After implementation:
6. Use `superpowers:verification-before-completion` before claiming done (OK — it verifies)

### BANNED skills (they ask questions, will stall the session):
- ~~superpowers:brainstorming~~ — asks "Want to try it?"
- ~~superpowers:writing-plans~~ — asks for approval
- ~~superpowers:requesting-code-review~~ — interactive

### Rule: Think first, then act. Every loop is expensive — do it right, don't ask.

## Design Principles

- **Mobile-first**: Every component designed for phone screens first
- **Fear-driven UX**: Red = danger, the grade should trigger emotional response
- **Share-ready**: Every result screen should be screenshot-worthy for social media
- **Bilingual**: Support both Chinese and English ingredient labels
- **Fast**: OCR + analysis should complete in under 3 seconds

## Protected Files (DO NOT MODIFY OR DELETE)

- `.ralph/` directory and all contents
- `.ralphrc`
- `features.json` (update status only, NEVER remove entries)
- `progress.txt` (append only, NEVER delete previous entries)
- `init.sh`
- `CLAUDE.md`

## Quality Standards

- TypeScript strict mode, no `any` types
- All components must have tests
- Commits follow conventional format: `feat(scope):`, `fix(scope):`, `test(scope):`
- Mobile-first responsive design (test at 375px width)
- Code must pass lint before commit

## RALPH_STATUS Block

At the end of your work, output this block so Ralph can parse your status:

```
RALPH_STATUS:
STATUS: WORKING | COMPLETE
EXIT_SIGNAL: false | true
WORK_TYPE: feature | bugfix | test | refactor
FILES_MODIFIED: [list of files]
SUMMARY: [one-line summary of what you did]
```

Set EXIT_SIGNAL to true ONLY when ALL features in features.json are "done".
