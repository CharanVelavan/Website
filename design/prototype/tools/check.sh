#!/bin/sh
# Standard screenshot pass for a v5 stage: hero, lab, flight path and contact, desktop and phone, light and dark.
# Usage: tools/check.sh [outDir]   (run from design/prototype after python3 assemble5.py && python3 mktest5.py)
cd "$(dirname "$0")/.." || exit 1
OUT=${1:-shots/v5}; mkdir -p "$OUT"
[ -d tools/node_modules ] || (cd tools && npm install --silent)
set --
for vp in desk phone; do for sec in top lab timeline contact; do for m in light dark; do set -- "$@" "$vp:$sec:$m"; done; done; done
node tools/shot.js test-v5.html "$OUT" "$@"
