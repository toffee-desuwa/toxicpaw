# Contributing to ToxicPaw

Thank you for your interest in contributing to ToxicPaw! This guide will help you get started.

## Getting Started

1. **Fork the repository** and clone your fork locally
2. **Install dependencies**: `npm install`
3. **Run the dev server**: `npm run dev`
4. **Run tests**: `npm test`

## Development Setup

### Prerequisites

- Node.js 18+
- npm 9+

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```
ANTHROPIC_API_KEY=your_key_here
```

The app works without an API key (AI explanations will be skipped), but you need one for full functionality.

## How to Contribute

### Reporting Bugs

- Use the GitHub Issues tab
- Include steps to reproduce, expected vs actual behavior, and screenshots if applicable
- Mention your browser and device (this is a mobile-first app)

### Suggesting Features

- Open a GitHub Issue with the "enhancement" label
- Describe the use case and why it would benefit pet owners

### Submitting Code

1. Create a feature branch from `main`: `git checkout -b feat/your-feature`
2. Make your changes following our conventions (below)
3. Write or update tests for your changes
4. Ensure all checks pass: `npm test && npm run lint && npm run build`
5. Commit using conventional format (see below)
6. Push and open a Pull Request

## Code Conventions

### TypeScript

- Strict mode enabled (`"strict": true`)
- No `any` types
- Use interfaces for object shapes, types for unions/intersections

### Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(scope): add new feature
fix(scope): fix a bug
test(scope): add or update tests
docs(scope): update documentation
refactor(scope): code refactoring
chore(scope): maintenance tasks
```

### Testing

- All components must have tests
- Use React Testing Library for component tests
- Use Jest for unit tests
- Run `npm test` before submitting a PR

### Styling

- Tailwind CSS v4 utility classes
- Mobile-first responsive design (test at 375px width)
- No inline styles or CSS modules

## Adding Ingredients

The ingredient knowledge base is in `data/ingredients.json`. To add a new ingredient:

```json
{
  "name": "Ingredient Name",
  "category": "protein|grain|vegetable|...",
  "safety_rating": "safe|caution|harmful",
  "explanation": "Why this ingredient is rated this way",
  "aliases": ["alternate name", "Chinese name"]
}
```

Make sure to:
- Check for duplicates before adding
- Include Chinese aliases if known
- Cite veterinary nutrition sources for the safety rating
- Add tests for any new categories or edge cases

## Code of Conduct

Be respectful, constructive, and inclusive. We're all here because we care about pet safety.

## Questions?

Open a GitHub Issue or start a Discussion. We're happy to help!
