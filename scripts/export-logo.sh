#!/bin/sh
# Render design/logo/*.svg to transparent PNGs with headless Chrome.
# Usage: scripts/export-logo.sh   (after python3 scripts/make-logo.py)
set -e
cd "$(dirname "$0")/../design/logo"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for name in full horizontal; do
  vb=$(sed -n 's/.*viewBox="\([^"]*\)".*/\1/p' "$name.svg" | head -1)
  w=$(echo "$vb" | awk '{print $3}'); h=$(echo "$vb" | awk '{print $4}')
  out_w=2400; out_h=$(awk -v w="$w" -v h="$h" -v o="$out_w" 'BEGIN{printf "%d", o*h/w + 0.5}')
  printf '<html><body style="margin:0;background:transparent"><img src="%s.svg" style="display:block;width:%dpx;height:%dpx"></body></html>' "$name" "$out_w" "$out_h" > ".render-$name.html"
  "$CHROME" --headless=new --disable-gpu --allow-file-access-from-files --hide-scrollbars \
    --default-background-color=00000000 --virtual-time-budget=3000 \
    --window-size="$out_w,$out_h" --screenshot="$PWD/hellish-views-$name.png" "file://$PWD/.render-$name.html" 2>/dev/null
  rm ".render-$name.html"
  echo "design/logo/hellish-views-$name.png  ${out_w}x${out_h}"
done
