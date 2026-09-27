#!/bin/sh
# Holt den aktuellen Stand aus dem Linux-Projekt und wendet die macOS-Anpassungen an.
# Aufruf: npm run sync:linux   (Quelle überschreibbar: DECKWERK_LINUX=/pfad/zu/deckwerk)
set -e
cd "$(dirname "$0")/.."
SRC="${DECKWERK_LINUX:-$HOME/deckwerk}"
[ -f "$SRC/package.json" ] || { echo "Linux-Projekt nicht gefunden: $SRC" >&2; exit 1; }
# Mac-eigene Dateien (README, Mac-Icon, Start-/Öffnen-Skripte, LibreOffice-Pfade, diese Sync-Skripte) bleiben
rsync -a --delete \
  --exclude node_modules --exclude out --exclude exports --exclude dist --exclude .git --exclude .github --exclude .claude \
  --exclude README.md --exclude install.sh --exclude assets/icon-mac.png --exclude scripts/deckwerk.sh --exclude scripts/open.mjs --exclude scripts/verify-pptx.ts \
  --exclude scripts/spike-embed-fonts.ts --exclude scripts/macify.mjs --exclude scripts/sync-linux.sh \
  "$SRC/" ./
node scripts/macify.mjs
