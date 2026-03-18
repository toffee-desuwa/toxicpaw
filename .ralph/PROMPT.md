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

## Superpowers Integration (MANDATORY)

You have superpowers skills installed. You MUST use them:

### Before implementing any feature:
1. Use `superpowers:brainstorming` to explore design choices for this feature
2. Use `superpowers:writing-plans` to create an implementation plan
3. Use `superpowers:test-driven-development` to write tests first

### During implementation:
4. Use `superpowers:systematic-debugging` when encountering any bug
5. Use `superpowers:dispatching-parallel-agents` for independent sub-tasks

### After implementation:
6. Use `superpowers:verification-before-completion` before claiming done
7. Use `superpowers:requesting-code-review` to review completed work

### Rule: Never skip brainstorming or TDD. Each loop is expensive - do it right the first time.

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
