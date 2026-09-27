#!/bin/sh
# Deckwerk für macOS installieren oder aktualisieren:
#   curl -fsSL https://raw.githubusercontent.com/Bavarianator/deckwerk-macos/main/install.sh | sh
# Lädt die DMG des neuesten Releases per curl (dadurch ohne Quarantäne-Markierung, Gatekeeper fragt nicht nach)
# und kopiert Deckwerk.app nach /Applications. Optional ein Release wählen: … | sh -s v0.1.0
set -e
[ "$(uname -s)" = Darwin ] && [ "$(uname -m)" = arm64 ] || { echo "Deckwerk braucht einen Mac mit Apple Silicon (M1 oder neuer)." >&2; exit 1; }
API=https://api.github.com/repos/Bavarianator/deckwerk-macos/releases
dmg_url() { curl -fsSL "$1" | grep -o '"browser_download_url": *"[^"]*\.dmg"' | cut -d'"' -f4 | head -1; }
if [ -n "$1" ]; then URL=$(dmg_url "$API/tags/$1")
else URL=$(dmg_url "$API/latest" || true); [ -n "$URL" ] || URL=$(dmg_url "$API/tags/latest"); fi
[ -n "$URL" ] || { echo "Keine DMG im Release gefunden." >&2; exit 1; }

TMP=$(mktemp -d); trap 'hdiutil detach -quiet "$MNT" 2>/dev/null; rm -rf "$TMP"' EXIT
echo "Lade $URL"
curl -fL --progress-bar "$URL" -o "$TMP/Deckwerk.dmg"
MNT=$(hdiutil attach -nobrowse -readonly "$TMP/Deckwerk.dmg" | tail -1 | cut -f3)
osascript -e 'quit app "Deckwerk"' 2>/dev/null || true
rm -rf /Applications/Deckwerk.app
ditto "$MNT/Deckwerk.app" /Applications/Deckwerk.app
echo "Deckwerk ist installiert: /Applications/Deckwerk.app (Launchpad, Spotlight)."
open /Applications/Deckwerk.app
