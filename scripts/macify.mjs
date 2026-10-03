// Wendet die macOS-Anpassungen auf den (frisch vom Linux-Stand kopierten) Quellcode an. Idempotent.
// Plattformabhängiges Verhalten (PATH, Dock, CoreML, MCP-Eintrag …) steckt inzwischen per process.platform im Linux-Code.
// Aufruf: node scripts/macify.mjs   (läuft automatisch in scripts/sync-linux.sh)
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

// package.json: X11-Flags raus, DMG-Build für Apple Silicon rein
const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
for (const k of Object.keys(pkg.scripts)) pkg.scripts[k] = pkg.scripts[k].replace(/ (-- )?--ozone-platform=x11/g, '')
pkg.author = 'Deckwerk'
pkg.license = 'AGPL-3.0-only'
// Eigene Versionsnummer der macOS-Ausgabe (die Linux-Version bleibt bei ihrer); Tag v<version> baut das Release
pkg.version = '0.1.3'
pkg.scripts.dist = 'electron-vite build && electron-builder --mac'
pkg.scripts['sync:linux'] = 'sh scripts/sync-linux.sh'
// Ein Schritt statt DMG: App bauen und direkt nach /Applications legen (erscheint in Launchpad und Spotlight)
pkg.scripts['install:mac'] = 'electron-vite build && electron-builder --mac --dir --arm64 && rm -rf /Applications/Deckwerk.app && ditto dist/mac-arm64/Deckwerk.app /Applications/Deckwerk.app && codesign --verify --deep --strict /Applications/Deckwerk.app && echo "Deckwerk liegt in /Applications (Launchpad, Spotlight)"'
pkg.devDependencies['electron-builder'] = '^26.0.0'
pkg.build = {
  appId: 'de.deckwerk.app', productName: 'Deckwerk', copyright: 'Copyright © 2026 Bavarianator',
  directories: { output: 'dist', buildResources: 'assets' },
  // Main und Renderer sind gebündelt; transformers/onnxruntime/sharp braucht zur Laufzeit niemand
  // onnxruntime-node (Freisteller) ist nativ: außerhalb des asar ablegen und nur die macOS-arm64-Binärdateien mitnehmen
  // Vite bündelt alles; zur Laufzeit lädt Main nur ajv (vom MCP-SDK per require erzeugt) und onnxruntime-node (nativ).
  // Daher node_modules per Whitelist: nur diese Pakete samt ihren Laufzeit-Abhängigkeiten, nur macOS-arm64-Binärdateien.
  // examples/: die Vorlagen auf dem Startbildschirm (templates:list liest sie aus dem App-Ordner)
  // skills/: SKILL.md für Claude Code/Codex (setup:mcp in ipc.ts liest ihn, install.sh kopiert ihn aus app.asar.unpacked)
  files: ['out/**', 'assets/**', 'examples/**', 'skills/**', 'package.json', '!node_modules/**',
    'node_modules/{ajv,ajv-formats,fast-deep-equal,fast-uri,json-schema-traverse,require-from-string,onnxruntime-common}/**',
    'node_modules/onnxruntime-node/{package.json,dist/**,bin/*/darwin/arm64/**}'],
  asarUnpack: ['node_modules/onnxruntime-node/**', 'skills/**'],
  npmRebuild: false,
  mac: { icon: 'assets/icon-mac.png', category: 'public.app-category.productivity', target: [{ target: 'dmg', arch: ['arm64'] }],
    // Ad-hoc-Signatur ('-'): ohne Developer-ID. identity: null ließe das Bundle unversiegelt, Apple Silicon meldet dann „beschädigt“.
    // Hardened Runtime nur für Notarisierung nötig; ohne Team-ID würde ihre Library Validation onnxruntime blockieren können.
    identity: '-', hardenedRuntime: false,
    // Handy-Fernbedienung (remote.ts) lauscht im LAN; Text für die Rückfrage von macOS
    extendInfo: { NSLocalNetworkUsageDescription: 'Deckwerk nutzt das lokale Netzwerk, damit du die Präsentation mit dem Handy steuern kannst.' } },
  // Fester Name ohne Version: install.sh lädt über …/releases/latest/download/Deckwerk-arm64.dmg, ohne GitHub-API (Rate-Limit)
  dmg: { title: 'Deckwerk', artifactName: 'Deckwerk-${arch}.${ext}' },
}
writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n')

// Tastenkürzel-Anzeigen: ⌘ statt Strg (die Handler prüfen ctrlKey || metaKey, funktionieren also schon)
const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]))
for (const f of walk('src/renderer').filter((f) => /\.tsx?$/.test(f))) {
  const s = readFileSync(f, 'utf8')
  const t = s.replace(/Strg\+(⇧\+|Umschalt\+)/g, '⌘⇧').replace(/Strg\+(\S)/g, '⌘$1').replaceAll('aus dem Dateimanager', 'aus dem Finder').replaceAll('<kbd>Strg</kbd>', '<kbd>⌘</kbd>').replaceAll('(F5)', '(⌥⌘P)').replaceAll('<kbd>F5</kbd>', '<kbd>⌥⌘P</kbd>')
  if (t !== s) writeFileSync(f, t)
}
// X11-Flag (nur Linux/Wayland) überall entfernen, wo Electron gestartet wird
for (const f of [...walk('src'), ...walk('scripts')].filter((f) => /\.tsx?$/.test(f))) {
  const s = readFileSync(f, 'utf8'), t = s.replaceAll(`'--ozone-platform=x11', `, '').replaceAll(`, '--ozone-platform=x11'`, '')
  if (t !== s) writeFileSync(f, t)
}

console.log('macOS-Anpassungen angewendet')
