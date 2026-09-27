# Deckwerk für macOS

KI-Präsentationsstudio für den Mac. Ein Satz genügt: Deckwerk schreibt die Storyline, baut die Folien und prüft jede einzelne als Bild. Danach gestaltest du frei weiter wie in Canva und exportierst nach PowerPoint, PDF oder als Bilder.

Das ist die macOS-Ausgabe (Apple Silicon) des Linux-Projekts Deckwerk.

## Was Deckwerk kann

- **Aus einem Satz ein Deck**: Storyline mit Action Titles, passende Layouts, Diagramme und Animationen. Die KI rendert jede Folie und prüft sie auf Überlauf, Kontrast und Aufbau.
- **Aus vorhandenem Material**: Datei auf den Startbildschirm ziehen (TXT, MD, CSV, JSON, DOCX, PPTX, PDF). Bei PPTX kommen auch die Bilder je Folie mit.
- **Frei gestalten**: Text, Formen, Fotos, Icons, Diagramme und QR-Codes direkt auf der Folie. Einrasten, Gruppieren, Ebenen, Freisteller für Fotos, Farben eines Decks mit einem Klick umfärben.
- **Ein Look für alles**: Themes, eigene Designs von der KI, Formate von 16:9 und 4:3 über Quadrat, 4:5 und Story (9:16) bis A4 und Link-Vorschau.
- **Präsentieren**: Vollbild, Referentenansicht mit Notizen und Zeit, Laserpointer und Stift, Handy als Fernbedienung über das WLAN.
- **Export**: PowerPoint (.pptx) mit echten, bearbeitbaren Objekten und Animationen, PDF, PNG je Folie, Handout (Markdown).
- **Auch aus Claude Code**: Deckwerk ist zugleich ein MCP-Server. Claude Code baut und bearbeitet Decks dann direkt aus dem Terminal.

## Voraussetzungen

- Mac mit **Apple Silicon** (M1 oder neuer). Intel-Macs werden nicht unterstützt.
- macOS 12 oder neuer. Getestet wird bei jedem Build auf dem aktuellen macOS von GitHub.
- Für die KI eins von beiden:
  - ein **Claude-Code-Login** (`claude` installiert und angemeldet), dann ist kein API-Key nötig, oder
  - ein **Anthropic-API-Key** (`sk-ant-…`).
- Optional: `brew install poppler` für den PDF-Import.

## Installation

### Mit einem Befehl (empfohlen)

Terminal öffnen und einfügen:

```sh
curl -fsSL https://raw.githubusercontent.com/Bavarianator/deckwerk-macos/main/install.sh | sh
```

Das Skript lädt die DMG des neuesten Releases, kopiert Deckwerk nach `/Applications` und startet es. Derselbe Befehl aktualisiert später. Eine bestimmte Version: `… | sh -s v0.1.2`.

Die App ist nicht von Apple notarisiert. Weil die Datei per `curl` kommt, trägt sie keine Quarantäne-Markierung, und macOS fragt nicht nach. Das umgeht die Gatekeeper-Prüfung bewusst. Führe den Befehl nur aus, wenn du diesem Repo vertraust. Das Skript ist kurz, lies es vorher: [install.sh](install.sh).

### Per DMG

1. `Deckwerk-arm64.dmg` von den [Releases](https://github.com/Bavarianator/deckwerk-macos/releases/latest) laden.
2. Öffnen und Deckwerk in „Programme“ ziehen.
3. Beim ersten Start blockiert macOS die App. Dann: Systemeinstellungen → Datenschutz & Sicherheit → ganz unten „Trotzdem öffnen“ → bestätigen. Danach startet sie normal.

### Selbst bauen

```sh
xcode-select --install                     # git und Compiler-Werkzeuge
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
eval "$(/opt/homebrew/bin/brew shellenv)"
brew install node poppler
node -p process.arch                       # muss "arm64" sagen, sonst läuft Electron unter Rosetta

git clone https://github.com/Bavarianator/deckwerk-macos.git ~/deckwerk-macos
cd ~/deckwerk-macos
npm install
npm run install:mac                        # baut Deckwerk.app, legt sie nach /Applications, prüft die Signatur
```

Selbst gebaut startet die App ohne Rückfrage. `npm run dist` baut stattdessen eine DMG zum Weitergeben, `npm run dev` startet ohne Installation.

## Erster Start

Ein Einrichtungsassistent führt durch die Einrichtung (jederzeit überspringbar):

1. **KI-Zugang**: Ist Claude Code installiert und angemeldet, nutzt Deckwerk dessen Login. Sonst den API-Key eintragen. Er liegt verschlüsselt über den macOS-Schlüsselbund auf deinem Mac.
2. **Modell**: Opus 5.5 (Standard), Fable 5.1 (am stärksten, langsamer), Sonnet 5 (schneller) oder Haiku 4.5 (für kleine Änderungen). Umschalten geht später jederzeit im Chat.
3. **Claude Code**: Auf Wunsch trägt Deckwerk sich als MCP-Server in Claude Code ein.
4. **Testen**: Eine kurze Probeanfrage zeigt, dass alles läuft.

Danach steht Deckwerk in Launchpad und Spotlight (⌘ Leertaste → „Deckwerk“). Ins Dock: Rechtsklick auf das Dock-Symbol → Optionen → Im Dock behalten.

## Bedienung

| Taste | Wirkung |
|---|---|
| `/` | Wunsch an die KI eingeben |
| ⌥⌘P oder F5 (fn+F5) | Präsentieren ab Folie 1, mit ⇧ ab der aktuellen Folie |
| ⌘Z / ⌘⇧Z | Rückgängig / Wiederholen |
| ⌘S | Speichern |
| ← → | Folien blättern |
| ⌘C / ⌘X / ⌘V / ⌘D | Kopieren, Ausschneiden, Einfügen, Duplizieren. ⌘V fügt auch Bilder aus der Zwischenablage ein |
| ⌘G / ⌘⇧G | Gruppieren / Gruppierung aufheben |
| ⌘] / ⌘[ | Eine Ebene nach vorne / hinten, mit ⇧ ganz nach vorne / hinten |
| ⌘L | Sperren |
| ⌫ | Auswahl löschen |
| ⌘ + Mausrad | Zoom |

Beim Präsentieren: → / Leertaste weiter, ← zurück, P Referentenansicht, L Laserpointer, D Stift, E Zeichnungen löschen, Esc beenden.

Bilder lassen sich aus dem Finder direkt auf die Folie ziehen. Ein Klick auf ein Element öffnet eine KI-Leiste für Wünsche genau zu diesem Element.

## Wo deine Daten liegen

| Ort | Inhalt |
|---|---|
| `~/Deckwerk/` | Deine Decks (`<titel>/deck.json`), eigene Bilder (`assets/`), Exporte |
| `~/Deckwerk/models/` | Modell für den Freisteller (rund 200 MB, lädt beim ersten Einsatz von Hugging Face) |
| `~/Library/Application Support/Deckwerk/` | Einstellungen und der verschlüsselte API-Key |

Updates lassen alles davon unangetastet.

## Aktualisieren und Deinstallieren

- **Aktualisieren**: den Installationsbefehl erneut ausführen, oder die neue DMG installieren. Selbst gebaut: `git pull && npm install && npm run install:mac`.
- **Deinstallieren**: `/Applications/Deckwerk.app` in den Papierkorb legen. Einstellungen entfernen: `rm -rf ~/Library/Application\ Support/Deckwerk`. Den MCP-Eintrag: `claude mcp remove -s user deckwerk`. `~/Deckwerk` enthält deine Decks und bleibt, bis du es selbst löschst.

## Claude Code (MCP-Server)

Claude Code bekommt dieselben Werkzeuge wie der Chat in der App (`create_deck`, `add_slides`, `render_slides`, `export_deck` …) plus `get_deck`, `save_deck` und `open_deck`. Der Einrichtungsassistent trägt den Server ein. Von Hand:

```sh
claude mcp add -s user deckwerk -- /Applications/Deckwerk.app/Contents/MacOS/Deckwerk --mcp
```

Decks landen unter `~/Deckwerk/<titel>/deck.json`. Die Umgebungsvariable `DECKWERK_HOME` wählt einen anderen Ordner.

## Probleme und Lösungen

| Problem | Lösung |
|---|---|
| „Deckwerk kann nicht geöffnet werden, da Apple es nicht auf Schadsoftware überprüfen kann“ | Systemeinstellungen → Datenschutz & Sicherheit → „Trotzdem öffnen“. Oder `xattr -cr /Applications/Deckwerk.app`. Oder per curl installieren. |
| „Deckwerk ist beschädigt“ | `xattr -cr /Applications/Deckwerk.app`, dann neu starten. |
| macOS meldet „Schadsoftware“ und verschiebt die App in den Papierkorb | Fehlalarm von XProtect, bekannt bei nicht notarisierten Electron-Apps unter macOS 27. Dauerhaft hilft nur die Notarisierung (siehe unten). |
| Chat antwortet nicht, Claude Code wird nicht gefunden | Deckwerk sucht `claude` in `/opt/homebrew/bin`, `/usr/local/bin` und `~/.local/bin`. Einmal `claude` im Terminal starten und anmelden, oder einen API-Key eintragen. |
| „PDF lesen braucht pdftotext“ | `brew install poppler` |
| Handy-Fernbedienung verbindet nicht | Beim ersten Mal fragt macOS, ob Deckwerk eingehende Verbindungen annehmen darf: „Erlauben“. Handy und Mac müssen im selben WLAN sein. |
| Freisteller braucht beim ersten Mal lange | Er lädt einmalig das Modell (rund 200 MB). Danach rechnet er lokal per CoreML auf Neural Engine und GPU. |

## Notarisieren (für Maintainer)

Mit einem Apple Developer Program (99 $/Jahr) notarisiert der GitHub-Build automatisch. Dann öffnet sich die App ohne jede Warnung, auch aus dem Browser geladen. Dazu diese Repository-Secrets setzen (Settings → Secrets and variables → Actions, oder `gh secret set NAME -R Bavarianator/deckwerk-macos`):

| Secret | Inhalt |
|---|---|
| `MAC_CERT_P12_BASE64` | Zertifikat „Developer ID Application“ als .p12 aus der Schlüsselbundverwaltung, dann `base64 -i cert.p12 \| pbcopy` |
| `MAC_CERT_PASSWORD` | Passwort des .p12-Exports |
| `APPLE_ID` | Apple-ID des Developer-Accounts |
| `APPLE_APP_SPECIFIC_PASSWORD` | App-spezifisches Passwort von account.apple.com |
| `APPLE_TEAM_ID` | Team-ID (developer.apple.com → Membership) |

## Für Entwickler

### Build und Release

GitHub baut die App bei jedem Push auf einem Apple-Silicon-Mac (`.github/workflows/mac.yml`) und prüft das fertige Paket, nicht nur den Quellcode:

- Signatur, und ob Gatekeeper die App als notarisiert erkennt
- Fenster startet (Screenshot als Artefakt „Pruefung“)
- Export eines Beispiel-Decks nach PPTX, PDF und PNG
- MCP-Server antwortet, natives onnxruntime lädt
- der curl-Installer gegen das eben veröffentlichte Release

Push auf `main` → Vorab-Release „latest“. Neue Version: in `scripts/macify.mjs` `pkg.version` erhöhen, `node scripts/macify.mjs`, committen, dann `git tag v<version> && git push origin v<version>` → festes Release. Der Build bricht ab, wenn Tag und Version nicht zusammenpassen.

### Stand der Linux-Version übernehmen

Dieses Repo ist die macOS-Ausgabe von `~/deckwerk`. Auf dem Rechner mit beiden Ordnern:

```sh
npm run sync:linux    # kopiert ~/deckwerk (oder DECKWERK_LINUX=…) und wendet scripts/macify.mjs an
```

Das Verhalten auf dem Mac steckt per `process.platform` im gemeinsamen Code: `PATH` um Homebrew und `~/.local/bin` ergänzt (aus Finder oder Dock gestartete Apps erben ihn nicht), kein Dock-Symbol ohne Fenster, Beenden beim Schließen des Fensters, Freisteller über CoreML und ohne die Linux-Sperre bei wenig freiem RAM, MCP-Eintrag der installierten App, ⌥⌘P zum Präsentieren.

`scripts/macify.mjs` erledigt nur noch, was ausschließlich den Mac-Build betrifft, und ist idempotent:

- `package.json`: DMG-Build für arm64 mit electron-builder, ad-hoc signiert ohne Hardened Runtime (mit Developer-ID-Secrets signiert und notarisiert der CI-Build), im Paket nur die Laufzeit-Module (`ajv`, `onnxruntime-node` mit arm64-Binärdateien), Info.plist-Text für das lokale Netzwerk, eigene Versionsnummer, keine X11-Flags.
- Anzeigen: ⌘ statt Strg, ⌥⌘P statt F5, „Finder“ statt „Dateimanager“.

Mac-eigene Dateien überschreibt der Sync nicht: README, LICENSE, `install.sh`, `.github/`, `assets/icon-mac.png`, `scripts/deckwerk.sh`, `open.mjs`, `verify-pptx.ts`, `spike-embed-fonts.ts`.

### Skripte

| Befehl | Zweck |
|---|---|
| `npm run dev` | App im Entwicklungsmodus |
| `npm run install:mac` | App bauen und nach `/Applications` legen |
| `npm run dist` | DMG nach `dist/` bauen |
| `npm run render examples/pitch.json` | Deck rendern → `exports/<slug>.pptx`, `.pdf`, `<slug>/NN.png` plus Lint-Report |
| `npm run check:layouts` | Stresstest: jedes Layout × Variante × Sample × Theme |
| `npm run smoke` | Agent-Tools und MCP-Server gegen eine Mock-Engine (ohne Electron, ohne API-Key) |
| `npm run mcp:e2e` | MCP-Server end-to-end gegen die echte Engine |
| `npm run smoke:claude` | App-Chat über Claude Code gegen eine Mock-Engine (braucht Claude-Code-Login) |
| `npm run verify:pptx -- exports/<slug>.pptx` | PPTX-Treue-Check gegen LibreOffice |
| `npm run open [-- exports/<datei>]` | Export mit der Standard-App öffnen (Keynote, PowerPoint, Vorschau) |
| `npm run sync:linux` | Stand der Linux-Version übernehmen |

### Chat über Claude Code

Ohne gespeicherten Key und ohne `ANTHROPIC_API_KEY` läuft der Chat über `claude -p` mit deinem Claude-Code-Login. Ein eingetragener Key hat Vorrang. `src/main/claude-agent.ts` öffnet dafür einen MCP-Server auf `127.0.0.1` (zufälliger Port, Bearer-Token in einer 0600-Datei im Temp-Ordner), der die Werkzeuge des aktuellen App-Decks bereitstellt. So zeigt die Live-Vorschau jede Änderung sofort. Claude Code läuft dabei ohne eingebaute Tools, Hooks, Plugins und Skills aus deinen Settings (`--setting-sources ""`) und mit dem Deckwerk-Systemprompt. Folgenachrichten setzen die Sitzung per `--resume` fort. Das Modell geht per `--model` raus, die Liste steht in `src/shared/models.ts`.

### PPTX-Treue-Check

PowerPoint bricht Text nur dann wie Chromium um, wenn Schriftmetriken und Boxbreiten passen. `scripts/verify-pptx.ts` rendert die PPTX mit LibreOffice, vergleicht jede Folie mit dem eigenen PNG und misst je Textbox Texthöhe und Versatz. Abweichende Höhe bedeutet anderen Umbruch. Ergebnis auf der Konsole und in `exports/verify/<slug>/report.json`.

```sh
brew install poppler && brew install --cask libreoffice
npm run render examples/quartal.json
npm run verify:pptx -- exports/q3-update-vertrieb.pptx
```

Kalibriert werden damit `WRAP_SLACK` und die Zeilenabstände in `src/main/export-pptx.ts`. Charts weichen in der PPTX immer ab, weil sie dort nativ sind. LibreOffice ist nicht PowerPoint; die endgültige Abnahme bleibt echtes PowerPoint.

## Lizenz

[GNU Affero General Public License v3.0](LICENSE) (AGPL-3.0-only). Du darfst Deckwerk nutzen, ändern und weitergeben. Weitergegebene oder als Netzdienst betriebene veränderte Fassungen müssen ihren Quellcode unter derselben Lizenz offenlegen.

Mitgelieferte Schriften stehen unter der SIL Open Font License (`assets/fonts/OFL-*.txt`), Beispielfotos unter der Unsplash-Lizenz (`examples/assets/CREDITS.md`, `assets/samples/CREDITS.md`).
