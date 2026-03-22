#!/usr/bin/env bash
# ============================================================
# ToxicPaw Harness Init Script
# Every Ralph session: build safety check → environment → status report
# ============================================================

set -euo pipefail

echo "=== ToxicPaw Session Init ==="
echo "Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 1. Verify project root
if [[ ! -f "CLAUDE.md" ]]; then
    echo "ERROR: Not in toxicpaw project root"
    exit 1
fi

# 2. Verify harness files
for f in features.json progress.txt CLAUDE.md; do
    if [[ ! -f "$f" ]]; then
        echo "ERROR: Missing harness file: $f"
        exit 1
    fi
done

# 3. Dependencies check
if [[ -f "package.json" ]] && [[ ! -d "node_modules" ]]; then
    echo "Installing npm dependencies..."
    npm install
fi

# 4. Build safety check with auto-revert
echo "--- Build Safety Check ---"
if [[ -f "package.json" ]]; then
    if ! npm run build --silent 2>/dev/null; then
        echo "WARN: Last commit has broken build. Auto-reverting..."
        git revert HEAD --no-edit
        npm install --silent 2>/dev/null
        if ! npm run build --silent 2>/dev/null; then
            echo "FAIL: Still broken after revert. Manual intervention needed."
            exit 1
        fi
        echo "Auto-reverted broken commit. Clean state restored."
    else
        echo "Build OK"
    fi
fi
echo ""

# 5. Lint check
echo "--- Lint Check ---"
npm run lint 2>&1 | tail -5
echo ""

# 6. Git status
echo "--- Git Status ---"
git status --short
echo ""
echo "Last 5 commits:"
git log --oneline -5
echo ""

# 7. Feature status summary
echo "--- Feature Status ---"
node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('features.json', 'utf8'));
const counts = {};
data.features.forEach(f => { counts[f.status] = (counts[f.status] || 0) + 1; });
Object.entries(counts).sort().forEach(([s, c]) => console.log('  ' + s + ': ' + c));
console.log('  total: ' + data.features.length);
"
echo ""

# 8. Last progress entry
echo "--- Last Progress Entry ---"
tail -5 progress.txt 2>/dev/null || echo "(no progress yet)"
echo ""

echo "=== Init Complete ==="
