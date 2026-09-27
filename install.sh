#!/bin/sh
# Deckwerk für macOS installieren oder aktualisieren:
#   curl -fsSL https://raw.githubusercontent.com/Bavarianator/deckwerk-macos/main/install.sh | sh
# Lädt die DMG des neuesten Releases per curl (dadurch ohne Quarantäne-Markierung, Gatekeeper fragt nicht nach)
# und kopiert Deckwerk.app nach /Applications. Optional ein Release wählen: … | sh -s v0.1.0
set -e
[ "$(uname -s)" = Darwin ] && [ "$(uname -m)" = arm64 ] || { echo "Deckwerk braucht einen Mac mit Apple Silicon (M1 oder neuer)." >&2; exit 1; }
BASE=https://github.com/Bavarianator/deckwerk-macos/releases
# Ohne Argument: neuestes festes Release, sonst der laufende Stand „latest“; mit Argument: dieses Release (z. B. v0.1.0)
if [ -n "$1" ]; then URLS="$BASE/download/$1/Deckwerk-arm64.dmg"
else URLS="$BASE/latest/download/Deckwerk-arm64.dmg $BASE/download/latest/Deckwerk-arm64.dmg"; fi

TMP=$(mktemp -d); trap 'hdiutil detach -quiet "$MNT" 2>/dev/null; rm -rf "$TMP"' EXIT
for URL in $URLS; do curl -fL --progress-bar "$URL" -o "$TMP/Deckwerk.dmg" && break; done
[ -s "$TMP/Deckwerk.dmg" ] || { echo "Download fehlgeschlagen: $URLS" >&2; exit 1; }
echo "Geladen: $URL"
MNT=$(hdiutil attach -nobrowse -readonly "$TMP/Deckwerk.dmg" | tail -1 | cut -f3)
osascript -e 'quit app "Deckwerk"' 2>/dev/null || true
rm -rf /Applications/Deckwerk.app
ditto "$MNT/Deckwerk.app" /Applications/Deckwerk.app
echo "Deckwerk ist installiert: /Applications/Deckwerk.app (Launchpad, Spotlight)."
open /Applications/Deckwerk.app
