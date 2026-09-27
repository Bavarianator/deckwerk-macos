# Deckwerk für macOS

KI-Präsentationsstudio für den Mac. Ein Satz genügt: Deckwerk schreibt die Storyline, baut die Folien und prüft jede einzelne als Bild. Danach gestaltest du frei weiter wie in Canva und exportierst nach PowerPoint, PDF oder als Bilder.

Das ist die macOS-Ausgabe (Apple Silicon) von [Deckwerk](https://github.com/Bavarianator/deckwerk) für Linux.

## Was Deckwerk kann

- **Aus einem Satz ein Deck**: Storyline mit Action Titles, passende Layouts, Diagramme und Animationen. Die KI rendert jede Folie und prüft sie auf Überlauf, Kontrast und Aufbau.
- **Aus vorhandenem Material**: Datei auf den Startbildschirm ziehen (TXT, MD, CSV, JSON, DOCX, PPTX, PDF). Bei PPTX kommen auch die Bilder je Folie mit.
- **Frei gestalten**: Text, Formen, Fotos, Icons, Diagramme, QR-Codes, Video und Audio direkt auf der Folie. Einrasten, Gruppieren, Ebenen, Zuschnitt, Freisteller für Fotos, Farben eines Decks mit einem Klick umfärben, Layout-Folien in freie Elemente umwandeln.
- **Ein Look für alles**: Themes, eigene Designs von der KI, Formate von 16:9 und 4:3 über Quadrat, 4:5 und Story (9:16) bis A4 und Link-Vorschau, dazu ein Hausstil, den sich die KI dauerhaft merkt.
- **Präsentieren**: Vollbild, Referentenansicht mit Notizen und Zeit, Laserpointer und Stift, Handy als Fernbedienung über das WLAN.
- **Export**: PowerPoint (.pptx) mit echten, bearbeitbaren Objekten und Animationen, PDF, PNG je Folie, Handout (Markdown).
- **Auch aus Claude Code, Codex und Vibe**: Deckwerk ist zugleich ein MCP-Server. Deine Agenten bauen und bearbeiten Decks dann direkt aus dem Terminal.

## Voraussetzungen

- Mac mit **Apple Silicon** (M1 oder neuer). Intel-Macs werden nicht unterstützt.
- macOS 12 oder neuer. Getestet wird bei jedem Build auf dem aktuellen macOS von GitHub.
- Für die KI eins davon:
  - der Login eines **Agenten-CLIs**: Claude Code (`claude`), Codex (`codex`) oder Mistral Vibe (`vibe`), installiert und angemeldet. Dann ist kein API-Key nötig.
  - ein **Anthropic-API-Key** (`sk-ant-…`).
- Optional: `brew install poppler` für den PDF-Import.

## Installation

### Mit einem Befehl (empfohlen)

Terminal öffnen und einfügen:

```sh
curl -fsSL https://raw.githubusercontent.com/Bavarianator/deckwerk-macos/main/install.sh | sh
```

Das Skript lädt die DMG des neuesten Releases, kopiert Deckwerk nach `/Applications`, trägt es als MCP-Server in Claude Code, Codex und Vibe ein (soweit installiert) und startet es. Derselbe Befehl aktualisiert später. Eine bestimmte Version: `… | sh -s v0.1.3`.

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

1. **KI-Zugang**: Deckwerk findet Claude Code, Codex und Vibe von selbst. Der Chat läuft über den Login des ersten gefundenen, bei mehreren wählst du per Klick. Ohne CLI trägst du einen Anthropic-API-Key ein; er liegt verschlüsselt über den macOS-Schlüsselbund auf deinem Mac und hat Vorrang.
2. **Modell**: Das Modell bestimmt auch, worüber der Chat läuft: Claude (Opus 5.5, Fable 5.1, Sonnet 5, Haiku 4.5), die Modelle aus deiner Vibe-Einstellung oder aus dem Codex-Katalog. Umschalten geht später jederzeit im Chat.
3. **Agenten**: Ein Klick trägt Deckwerk als MCP-Server in Claude Code, Codex und Vibe ein, einzeln oder in alle gefundenen zugleich.
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

## Mit der KI arbeiten

- Der Chat unten im Editor nimmt Wünsche fürs ganze Deck entgegen. Er weiß immer, welche Folie du gerade ansiehst. Ein Klick auf ein Element der Folie öffnet eine KI-Leiste für genau dieses Element.
- Das **Modell** wählst du im Dropdown neben dem Eingabefeld. Es bestimmt auch, worüber der Chat läuft:
  - **Claude:** Opus 5.5 (Standard), Fable 5.1, Sonnet 5 oder Haiku 4.5, über den API-Key oder Claude Code.
  - **Vibe:** die Modelle aus deiner Vibe-Einstellung.
  - **Codex:** die Modelle aus dem Codex-Katalog.

  Angeboten wird nur, was installiert ist. Die Wahl gilt ab der nächsten Nachricht und bleibt gespeichert. Wechselst du den Anbieter, beginnt ein neues Gespräch; das Deck bleibt. Vibe und Codex antworten spürbar langsamer als Claude.
- Unter den Notizen schreibt „Schreiben lassen“ die Sprechernotizen, „Überarbeiten“ verbessert vorhandene. Daneben steht die geschätzte Sprechzeit.
- **Hausstil:** Sag „merk dir …“, und die KI trägt die Vorliebe in `~/Deckwerk/hausstil.md` ein. Die Datei gilt für jedes künftige Deck und lässt sich von Hand bearbeiten.
- **Fotos:** Die KI nutzt zuerst deine Bilder aus `~/Deckwerk/assets`. Findet sie dort nichts Passendes und ist `UNSPLASH_ACCESS_KEY` gesetzt, sucht sie auf Unsplash und übernimmt den Bildnachweis in die Notizen.

## Speichern und Versionen

Deckwerk speichert automatisch. Jede Änderung, ob von dir oder von der KI, landet nach 1,5 Sekunden in `~/Deckwerk/<titel>/deck.json`. Schließt du das Fenster oder öffnest ein anderes Deck, sichert Deckwerk offene Änderungen vorher.

Höchstens alle 10 Minuten legt Deckwerk den vorigen Stand unter `<deck>/versions/` ab, pro Deck bis zu 100 Versionen. Um zu einer Version zurückzukehren, öffnest du sie über „Deck öffnen“. Sie wird wieder zum Deck, und der bisherige Stand wandert selbst in die Versionen.

Ein Deck-Ordner lässt sich weitergeben: Bildpfade relativ zur deck.json (`assets/foto.jpg`) löst Deckwerk beim Öffnen auf.

## Wo deine Daten liegen

| Ort | Inhalt |
|---|---|
| `~/Deckwerk/<titel>/deck.json` | Deine Decks; Exporte landen daneben |
| `~/Deckwerk/<titel>/versions/` | Frühere Stände eines Decks |
| `~/Deckwerk/assets/` | Eigene, eingefügte und freigestellte Bilder, geladene Fotos |
| `~/Deckwerk/hausstil.md` | Hausstil für alle Decks |
| `~/Deckwerk/models/` | Modell für den Freisteller (rund 200 MB, lädt beim ersten Einsatz von Hugging Face) |
| `~/Library/Application Support/Deckwerk/` | Einstellungen und der verschlüsselte API-Key |

Updates lassen alles davon unangetastet.

## Datenschutz und Sicherheit

- **Was an die KI geht:** Deine Wünsche, der Inhalt des Decks, angehängtes Quellmaterial und gerenderte Folienbilder gehen an den Anbieter deines KI-Zugangs: Anthropic (API oder Claude Code), OpenAI (Codex) oder Mistral (Vibe). Bei einer Web-Recherche ruft die KI Webseiten ab.
- **Chat über Claude Code, Codex oder Vibe:** Das CLI bekommt nur die Deckwerk-Werkzeuge (dazu Web-Recherche), keine Shell und keine Dateiwerkzeuge. Ein präpariertes Quelldokument kann so keine Befehle auf deinem Mac ausführen.
- **Was lokal bleibt:** Freisteller, Rendering und Export laufen auf deinem Mac.
- **Fremde Decks:** Decks binden nur Bilder (PNG, JPEG, GIF, WebP, SVG, AVIF, BMP), Video, Audio und Schriften ein. Andere Dateien verweigert Deckwerk. So kann ein fremdes Deck keine privaten Dateien in einen Export ziehen.
- **App-Fenster:** Alle Fenster laufen in der Chromium-Sandbox und können nicht auf fremde Seiten wechseln.
- **Handy-Fernbedienung:** Sie läuft nur, solange du sie in der Referentenansicht geöffnet hast. Die Verbindung geht über HTTP mit einem zufälligen Token und ist unverschlüsselt, in fremden WLANs also mitlesbar.
- **Signatur:** Die App ist ad-hoc signiert, aber nicht von Apple notarisiert (siehe „Notarisieren“).

## Grenzen

- Nur Macs mit Apple Silicon. Nicht notarisiert, daher beim DMG-Weg einmal „Trotzdem öffnen“. Kein Auto-Update: der Installationsbefehl aktualisiert.
- Die PowerPoint-Dateien sind gegen LibreOffice geprüft. Die Abnahme in echtem PowerPoint (Umbrüche, Animationen, eingebettete Schriften) steht noch aus.
- Diagramme sind in PowerPoint nativ und sehen deshalb leicht anders aus als in der Vorschau.
- Text-Deckkraft kommt nicht in PowerPoint an, und Gruppen landen dort als Einzelobjekte.
- Gedrehte Bilder lassen sich erst nach Drehung auf 0° zuschneiden.
- Es gibt keine Echtzeit-Zusammenarbeit.
- Codex ist mit einem angemeldeten Konto noch nicht getestet, weder als Chat noch als MCP-Client. Getestet sind Einrichtung und Modellliste.

## Aktualisieren und Deinstallieren

- **Aktualisieren**: den Installationsbefehl erneut ausführen, oder die neue DMG installieren. Selbst gebaut: `git pull && npm install && npm run install:mac`.
- **Deinstallieren**: `/Applications/Deckwerk.app` in den Papierkorb legen. Einstellungen entfernen: `rm -rf ~/Library/Application\ Support/Deckwerk`. Die MCP-Einträge: `claude mcp remove -s user deckwerk`, `vibe mcp remove deckwerk`, `codex mcp remove deckwerk`. `~/Deckwerk` enthält deine Decks und bleibt, bis du es selbst löschst.

## Claude Code, Codex und Vibe

**Deckwerk als Werkzeug deiner Agenten (MCP-Server):** Claude Code, Codex und Vibe bekommen dieselben Werkzeuge wie der Chat in der App (`create_deck`, `add_slides`, `render_slides`, `export_deck` …) plus `get_deck`, `save_deck` und `open_deck`. Der Installer und die Einrichtung tragen den Server ein. Von Hand:

```sh
claude mcp add -s user deckwerk -- /Applications/Deckwerk.app/Contents/MacOS/Deckwerk --mcp
vibe mcp add deckwerk --transport stdio --command /Applications/Deckwerk.app/Contents/MacOS/Deckwerk --arg=--mcp --startup-timeout-sec 90 --tool-timeout-sec 300
codex mcp add deckwerk -- /Applications/Deckwerk.app/Contents/MacOS/Deckwerk --mcp   # danach in ~/.codex/config.toml unter [mcp_servers.deckwerk]: startup_timeout_sec = 90
```

Decks landen unter `~/Deckwerk/<titel>/deck.json`. Die Umgebungsvariable `DECKWERK_HOME` wählt einen anderen Ordner.

**Der Chat in der App über deinen Agenten:** Wählst du im Modell-Dropdown ein Vibe- oder Codex-Modell oder hast du keinen API-Key, läuft der Chat über `claude -p`, `codex exec` oder `vibe -p` mit deinem Login. Das CLI bekommt dabei nur die Deckwerk-Werkzeuge und die Web-Recherche, keine Shell und keine Dateiwerkzeuge. Ein präpariertes Quelldokument kann so keine Befehle auf deinem Mac ausführen. Der Chat über Codex ist noch nicht mit einem angemeldeten Codex getestet; Claude Code und Vibe sind es.

## Probleme und Lösungen

| Problem | Lösung |
|---|---|
| „Deckwerk kann nicht geöffnet werden, da Apple es nicht auf Schadsoftware überprüfen kann“ | Systemeinstellungen → Datenschutz & Sicherheit → „Trotzdem öffnen“. Oder `xattr -cr /Applications/Deckwerk.app`. Oder per curl installieren. |
| „Deckwerk ist beschädigt“ | `xattr -cr /Applications/Deckwerk.app`, dann neu starten. |
| macOS meldet „Schadsoftware“ und verschiebt die App in den Papierkorb | Fehlalarm von XProtect, bekannt bei nicht notarisierten Electron-Apps unter macOS 27. Dauerhaft hilft nur die Notarisierung (siehe unten). |
| Chat antwortet nicht, Claude Code, Codex oder Vibe wird nicht gefunden | Deckwerk sucht die CLIs in `/opt/homebrew/bin`, `/usr/local/bin` und `~/.local/bin`. Einmal im Terminal starten und anmelden (`claude`, `codex login`, `vibe --setup`), oder einen API-Key eintragen. |
| „Codex ist nicht angemeldet“ | Im Terminal `codex login` ausführen. |
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

Mac-eigene Dateien überschreibt der Sync nicht: README, LICENSE, `install.sh`, und den Linux-Installer `scripts/install.sh` holt er gar nicht erst, `.github/`, `assets/icon-mac.png`, `scripts/deckwerk.sh`, `open.mjs`, `verify-pptx.ts`, `spike-embed-fonts.ts`.

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

### Chat über Claude Code, Codex und Vibe

Welches CLI der Chat nutzt, folgt aus dem Modell im Dropdown (`src/shared/models.ts`: Claude-IDs, `vibe:<alias>`, `codex:<slug>`); ein Claude-Modell ohne API-Key läuft über Claude Code. `src/main/claude-agent.ts` öffnet dafür einen MCP-Server auf `127.0.0.1`: zufälliger Port, Bearer-Token nie auf der Kommandozeile (für Claude Code in einer 0600-Datei, die beim Beenden gelöscht wird, für Codex und Vibe in einer Umgebungsvariable des Kindprozesses). Der Prompt geht über stdin, die Live-Vorschau sieht jede Änderung sofort.

Jedes CLI bekommt nur die Deckwerk-Werkzeuge und die Web-Recherche:

- **Claude Code:** `--tools WebSearch,WebFetch`, `--strict-mcp-config`, ohne Hooks, Plugins und Skills aus deinen Einstellungen (`--setting-sources ""`). Folgenachrichten per `--resume`, Modell per `--model`.
- **Codex:** `--ignore-user-config`, `shell_tool`, `unified_exec` und `hooks` aus, `sandbox_mode="read-only"`, `approval_policy="never"`, Systemprompt als `developer_instructions`, Modell per `-c model=…`. Folgenachrichten per `exec resume`.
- **Vibe:** `VIBE_MCP_SERVERS` ersetzt deine MCP-Server, `--enabled-tools deckwerk_*` (plus `web_search`, `web_fetch`) sperrt alle anderen Werkzeuge, auch Shell und Dateien. Modell per `VIBE_ACTIVE_MODEL`, ohne Werkzeugsuche (`--legacy-harness`). Der Systemprompt steht vor der ersten Nachricht, Folgenachrichten per `--resume`.

Test: `npm run smoke:claude`, für die anderen CLIs `DECKWERK_CLI=vibe` oder `codex` davor (samt Probe, dass Shell und Dateien gesperrt sind).

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
