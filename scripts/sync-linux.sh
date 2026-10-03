#!/bin/sh
# Holt den committeten Stand des Linux-Projekts und wendet die macOS-Anpassungen an.
# Aufruf: npm run sync:linux   (Quelle überschreibbar: DECKWERK_LINUX=/pfad/zu/deckwerk)
set -e
cd "$(dirname "$0")/.."
SRC="${DECKWERK_LINUX:-$HOME/deckwerk}"
[ -f "$SRC/package.json" ] || { echo "Linux-Projekt nicht gefunden: $SRC" >&2; exit 1; }
# Nur den committeten Stand (HEAD) übernehmen: im Arbeitsverzeichnis von ~/deckwerk liegt oft Unfertiges anderer Sitzungen
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
git -C "$SRC" archive HEAD | tar -x -C "$TMP"
echo "Übernehme $(git -C "$SRC" log -1 --format='%h %s' HEAD)"
# Mac-eigene Dateien (README, CLAUDE.md, Mac-Icon, keine Linux-Installer, Workflows, diese Sync-Skripte) bleiben
rsync -a --delete --checksum \
  --exclude node_modules --exclude out --exclude exports --exclude dist --exclude .git --exclude .github --exclude .claude \
  --exclude README.md --exclude CLAUDE.md --exclude LICENSE --exclude install.sh --exclude scripts/install.sh --exclude scripts/uninstall.sh --exclude assets/icon-mac.png \
  --exclude scripts/deckwerk.sh --exclude scripts/open.mjs --exclude scripts/verify-pptx.ts \
  --exclude scripts/spike-embed-fonts.ts --exclude scripts/macify.mjs --exclude scripts/sync-linux.sh \
  "$TMP/" ./
node scripts/macify.mjs
