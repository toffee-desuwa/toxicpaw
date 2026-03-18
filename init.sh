#!/bin/bash
# ToxicPaw - Session initialization script
# Run at the start of every Ralph loop to verify environment

set -e

echo "=== ToxicPaw Session Init ==="

# Verify we're in the right directory
if [[ ! -f "CLAUDE.md" ]]; then
    echo "ERROR: Not in toxicpaw project root"
    exit 1
fi

# Verify harness files exist
for f in features.json progress.txt CLAUDE.md; do
    if [[ ! -f "$f" ]]; then
        echo "ERROR: Missing harness file: $f"
        exit 1
    fi
done

# Check git status
echo "Git status:"
git status --short

# Show last 3 commits for context
echo ""
echo "Recent commits:"
git log --oneline -3 2>/dev/null || echo "(no commits yet)"

# Show feature progress
echo ""
echo "Feature progress:"
total=$(cat features.json | grep '"id"' | wc -l)
done=$(cat features.json | grep '"status": "done"' | wc -l)
in_progress=$(cat features.json | grep '"status": "in_progress"' | wc -l)
echo "  Total: $total | Done: $done | In Progress: $in_progress | Remaining: $((total - done - in_progress))"

# Check if node_modules exists (after F001)
if [[ -f "package.json" ]] && [[ ! -d "node_modules" ]]; then
    echo ""
    echo "Installing npm dependencies..."
    npm install
fi

echo ""
echo "=== Init complete. Read progress.txt and features.json, then work on the next pending feature. ==="
