// Wendet die macOS-Anpassungen auf den (frisch vom Linux-Stand kopierten) Quellcode an. Idempotent.
// Bricht ab, wenn eine Ankerstelle im Linux-Code fehlt: dann hat sich der Code geändert und der Patch muss nachgezogen werden.
// Aufruf: node scripts/macify.mjs   (läuft automatisch in scripts/sync-linux.sh)
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const patch = (file, pairs) => {
  let s = readFileSync(file, 'utf8')
  for (const [from, to] of pairs) {
    if (s.includes(to)) continue // schon angewendet
    if (!s.includes(from)) throw new Error(`${file}: Ankerstelle fehlt:\n${from}`)
    s = s.replace(from, to)
  }
  writeFileSync(file, s)
}

// package.json: X11-Flags raus, DMG-Build für Apple Silicon rein
const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
for (const k of Object.keys(pkg.scripts)) pkg.scripts[k] = pkg.scripts[k].replace(/ (-- )?--ozone-platform=x11/g, '')
pkg.author = 'Deckwerk'
pkg.scripts.dist = 'electron-vite build && electron-builder --mac'
pkg.scripts['sync:linux'] = 'sh scripts/sync-linux.sh'
// Ein Schritt statt DMG: App bauen und direkt nach /Applications legen (erscheint in Launchpad und Spotlight)
pkg.scripts['install:mac'] = 'electron-vite build && electron-builder --mac --dir --arm64 && rm -rf /Applications/Deckwerk.app && ditto dist/mac-arm64/Deckwerk.app /Applications/Deckwerk.app && codesign --verify --deep --strict /Applications/Deckwerk.app && echo "Deckwerk liegt in /Applications (Launchpad, Spotlight)"'
pkg.devDependencies['electron-builder'] = '^26.0.0'
pkg.build = {
  appId: 'de.deckwerk.app', productName: 'Deckwerk', copyright: 'Deckwerk',
  directories: { output: 'dist', buildResources: 'assets' },
  // Main und Renderer sind gebündelt; transformers/onnxruntime/sharp braucht zur Laufzeit niemand
  // onnxruntime-node (Freisteller) ist nativ: außerhalb des asar ablegen und nur die macOS-arm64-Binärdateien mitnehmen
  // Vite bündelt alles; zur Laufzeit lädt Main nur ajv (vom MCP-SDK per require erzeugt) und onnxruntime-node (nativ).
  // Daher node_modules per Whitelist: nur diese Pakete samt ihren Laufzeit-Abhängigkeiten, nur macOS-arm64-Binärdateien.
  files: ['out/**', 'assets/**', 'package.json', '!node_modules/**',
    'node_modules/{ajv,ajv-formats,fast-deep-equal,fast-uri,json-schema-traverse,require-from-string,onnxruntime-common}/**',
    'node_modules/onnxruntime-node/{package.json,dist/**,bin/*/darwin/arm64/**}'],
  asarUnpack: ['node_modules/onnxruntime-node/**'],
  npmRebuild: false,
  mac: { icon: 'assets/icon-mac.png', category: 'public.app-category.productivity', target: [{ target: 'dmg', arch: ['arm64'] }],
    // Ad-hoc-Signatur ('-'): ohne Developer-ID. identity: null ließe das Bundle unversiegelt, Apple Silicon meldet dann „beschädigt“.
    // Hardened Runtime nur für Notarisierung nötig; ohne Team-ID würde ihre Library Validation onnxruntime blockieren können.
    identity: '-', hardenedRuntime: false },
  dmg: { title: 'Deckwerk' },
}
writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n')

patch('src/main/index.ts', [
  [`import type { createEngine } from './engine'\n`, `import type { createEngine } from './engine'

// macOS: Aus Finder/Dock gestartet erbt die App nur /usr/bin:/bin:/usr/sbin:/sbin. Homebrew und ~/.local/bin fehlen,
// dann findet der Chat weder \`claude\` noch das \`node\` für ein per npm installiertes claude.
process.env.PATH = [process.env.PATH, '/opt/homebrew/bin', '/usr/local/bin', process.env.HOME + '/.local/bin'].join(':')
// Ohne Fenster (MCP-Server, Render-CLI) kein Dock-Symbol
if (['--mcp', '--render', '--check'].some((f) => process.argv.includes(f))) app.dock?.hide()
`],
  [`app.on('window-all-closed', () => {\n  if (process.platform !== 'darwin') app.quit()\n})`,
   `// Auch unter macOS beenden: IPC hängt am einen Hauptfenster, ein neues Fenster per Dock-Klick hätte keins\napp.on('window-all-closed', () => app.quit())`],
])

// Freisteller (onnxruntime-node im Main-Prozess): auf Apple Silicon zuerst CoreML (Neural Engine/GPU), sonst CPU.
// Die freemem()-Sperre schützt vor dem Linux-OOM-Killer; macOS zählt Dateicache als belegt (freemem() fast immer < 1 GB)
// und lagert bei Bedarf komprimiert aus, dort würde sie den Freisteller dauerhaft blockieren.
{
  const f = 'src/main/bg-remove.ts'
  let s = readFileSync(f, 'utf8')
  const create = /ort\.InferenceSession\.create\(file, \{ executionProviders: \['cpu'\], ([^}]*?) \}\)/
  if (!s.includes(`executionProviders: ['coreml', 'cpu']`)) {
    if (!create.test(s)) throw new Error(`${f}: InferenceSession.create nicht gefunden`)
    s = s.replace(create, (_, o) => `ort.InferenceSession.create(file, { executionProviders: ['coreml', 'cpu'], ${o} })
      .catch(() => ort.InferenceSession.create(file, { executionProviders: ['cpu'], ${o} }))`)
  }
  if (!s.includes(`process.platform === 'linux' && freemem()`)) {
    if (!s.includes('if (freemem() <')) throw new Error(`${f}: freemem()-Prüfung nicht gefunden`)
    s = s.replace('if (freemem() <', `if (process.platform === 'linux' && freemem() <`)
  }
  writeFileSync(f, s)
}

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

// MCP-Eintrag aus der installierten App: das App-Binary selbst, ohne Pfad zum app.asar
patch('src/main/ipc.ts', [
  [`{ command: process.execPath, args: [app.getAppPath(), '--mcp'] }`,
   `app.isPackaged ? { command: process.execPath, args: ['--mcp'] } : { command: process.execPath, args: [app.getAppPath(), '--mcp'] }`],
])
// Beispiel-Decks: absolute Linux-Pfade → relativ zur JSON-Datei; das Render-CLI löst dann auch Video-Poster auf
for (const f of readdirSync('examples').filter((f) => f.endsWith('.json')).map((f) => join('examples', f))) {
  const s = readFileSync(f, 'utf8'), t = s.replace(/asset:\/\/local\/[^"]*?\/examples\//g, '')
  if (t !== s) writeFileSync(f, t)
}
patch('src/main/index.ts', [
  [`if ((k === 'src' || k === 'image') && typeof o[k] === 'string')`, `if ((k === 'src' || k === 'image' || k === 'poster') && typeof o[k] === 'string')`],
])
// Präsentieren: F5 braucht auf Mac-Tastaturen fn, daher zusätzlich ⌥⌘P wie in Keynote (e.code, weil ⌥P als „π“ ankommt)
patch('src/renderer/App.tsx', [
  [`else if (e.key === 'F5' && deck?.slides.length)`, `else if ((e.key === 'F5' || (e.metaKey && e.altKey && e.code === 'KeyP')) && deck?.slides.length)`],
])
console.log('macOS-Anpassungen angewendet')
