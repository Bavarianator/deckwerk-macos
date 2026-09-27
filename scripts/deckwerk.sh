#!/bin/sh
# Startet Deckwerk aus dem Quellordner (mit --mcp als MCP-Server für Claude Code, daher Build-Ausgabe nach stderr).
# Baut vorher neu, wenn sich Quellen seit dem letzten Build geändert haben. Die installierte App braucht dieses Skript nicht.
cd "$(dirname "$(readlink -f "$0")")/.." || exit 1
# --mcp: Claude Code wartet höchstens 30 s auf den Server, ein Build dauert länger → vorhandenen Build nehmen
case " $* " in *" --mcp "*) [ -f out/main/index.js ] && exec ./node_modules/.bin/electron . "$@" ;; esac
if [ ! -f out/main/index.js ] || [ -n "$(find src assets package.json -newer out/main/index.js -print -quit)" ]; then
  ./node_modules/.bin/electron-vite build >&2 || { osascript -e 'display notification "Build fehlgeschlagen. Details: npm run build" with title "Deckwerk"' 2>/dev/null; exit 1; }
fi
exec ./node_modules/.bin/electron . "$@"
