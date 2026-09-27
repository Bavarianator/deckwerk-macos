# Canva AI vs. Deckwerk: Was die KI dort kann und hier nicht

Stand: 27.09.2026. Ergänzt `CANVA-VERGLEICH.md` (dort: Design, Layouts, Effekte). Hier geht es nur um die **KI-Funktionen** von Canva (Magic Studio, Canva AI 2.0 seit April 2026) und um die Frage, welche davon Deckwerk fehlen.

## 1. Was Canva AI heute kann

| Funktion | Was sie tut | Seit |
|---|---|---|
| Canva AI 2.0 (Chat) | Gespräch statt Werkzeugwahl; der Agent plant, ruft Werkzeuge nacheinander auf, liefert mehrere editierbare Entwürfe | 04/2026 |
| Memory Library | merkt sich Vorlieben (Stil, Tonfall, Marke) über Projekte hinweg und wendet sie automatisch an | 04/2026 |
| Connectors | holt Kontext aus Slack, Gmail, Drive, Kalender, Notion, Zoom, HubSpot in das Briefing | 04/2026 |
| Web Research | recherchiert im Netz und legt die Ergebnisse direkt in ein Design | 04/2026 |
| Scheduling | wiederkehrende Aufgaben im Hintergrund (Entwürfe zur Freigabe) | 04/2026 |
| Magic Design (Präsentation) | Deck aus Prompt oder aus Dokument, mit Brand Kit | 2023, 2026 brand-aware |
| Magic Switch | Format wechseln (Deck → Doc, Social, A4), übersetzen, zusammenfassen | 2023 |
| Magic Write + Brand Voice | Texte schreiben, umschreiben, kürzen, Tonfall der Marke | 2023 |
| Sprechernotizen per KI | Notizen per Prompt erzeugen, **Sprechzeit-Schätzung**, Schriftgröße im Notizfeld | 05/2026 |
| Magic Charts + Magic Insights | Diagramm aus Rohdaten, dazu eine erklärende Kernaussage | 02/2026 |
| Sheets AI | Tabelle aus Beschreibung, mit echten Daten befüllt | 04/2026 |
| Dream Lab / Magic Media | Bilder aus Text, Style Match (neue Grafiken übernehmen Farben/Stil des Designs), Stil per Referenzbild | 2024, 02/2026 |
| Image to Video | Foto → 3-s-Clip mit Bewegung | 02/2026 |
| Magic Layers | flaches Bild → editierbare Ebenen mit Live-Text | 03/2026 |
| Magic Edit / Eraser / Grab / Expand | generative Bildbearbeitung | 2023 |
| Magic Animate / Morph | Animationen passend zum Design, Text/Formen verwandeln | 2023 |
| Canva Code 2.0, HTML-Import | interaktive Seiten per Prompt, HTML-Artefakte importieren und bearbeiten | 04/2026 |
| Integrationen | Canva als Werkzeug in Claude, ChatGPT, Copilot, Gemini | 01–06/2026 |

## 2. Was Deckwerk davon schon hat

- Chat-Agent mit Werkzeugen, Selbstprüfung (`lint_deck`, `render_overview`), Storyline-Plan, Rückfragen, **drei Look-Vorschläge** (`propose_looks`), „Andere Gestaltung“ pro Folie.
- Brand Kit (Farbe, Logo, Schrift), eigene Themes durch die KI, Formate (1:1, 9:16, A4 …) mit Kopien.
- Native Charts mit Diagramm-Editor und „Passt der Titel noch?“-Prüfung.
- Freisteller, Bildanpassung, Morph-Übergang, Animationen, Unsplash-Suche.
- Als MCP-Server in Claude Code nutzbar (entspricht der Canva-Integration in Claude).
- Übersetzen, Kürzen, Umschreiben gehen per Chat, ohne eigenes Werkzeug.

## 3. Lücken

| # | Lücke | Nutzen für Business-Decks | Aufwand | Entscheidung |
|---|---|---|---|---|
| L1 | **Quellmaterial anhängen** (TXT, MD, DOCX, PDF → Deck), Canvas „Deck aus Dokument“ | sehr hoch: der häufigste echte Einstieg | S–M | bauen |
| L2 | **Sprechzeit-Schätzung** pro Folie und gesamt (Notizfeld, Presenter) | hoch, trivial | S | bauen |
| L3 | **Notizen per KI** (Knopf am Notizfeld: für diese Folie / alle Folien) | hoch | S | bauen |
| L4 | **Handout als Markdown** (Titel, Inhalte, Notizen) – Magic Switch „Deck → Doc“ | mittel | S | bauen |
| L5 | **Tonfall der Marke** (Brand Voice): Freitext im Brand Kit, geht in den Prompt | mittel | S | bauen |
| L6 | **Gedächtnis** über Decks hinweg (Vorlieben, Korrekturen des Nutzers) | mittel | M | später: Datei im userData, die der Agent liest/schreibt |
| L7 | Web-Recherche im App-Chat | mittel | M | im Claude-Code-Modus schon vorhanden (WebSearch); für den API-Modus später |
| L8 | Magic Insights: Kernaussage aus Diagrammdaten vorschlagen | mittel | S | vorhanden über Chart-Editor-Prüfung; kein eigenes Werkzeug nötig |
| L9 | PPTX/PDF importieren und bearbeitbar machen (Magic Layers für Folien) | hoch, aber teuer | L | offen, eigene Planung |
| L10 | KI-Bilder, Style Match, Image to Video, Magic Edit/Eraser/Expand | niedrig für Business-Decks | M–L | weggelassen, braucht Bildmodell + Key (siehe CANVA-VERGLEICH 3.5) |
| L11 | Connectors (Slack, Mail, Drive), Scheduling | niedrig für ein lokales Werkzeug | L | weggelassen |
| L12 | Canva Code / HTML-Import | niedrig | L | weggelassen |

## 4. Umsetzungsstand

| # | Stand | Wo |
|---|---|---|
| L1 | offen | |
| L2 | offen | |
| L3 | offen | |
| L4 | offen | |
| L5 | offen | |

## Quellen

- [TechCrunch: Canva's AI assistant can now call various tools (16.04.2026)](https://techcrunch.com/2026/04/16/canvas-ai-assistant-can-now-call-various-tools-to-make-designs-for-you/)
- [Canva AI Assistant: 7 Facts About Canva AI 2.0](https://www.progressiverobot.com/2026/04/19/canva-ai-assistant/)
- [Canva Release Notes 2026 (Releasebot)](https://releasebot.io/updates/canva)
- [Forbes: Canva AI 2.0 launches (16.04.2026)](https://www.forbes.com/sites/marksparrow/2026/04/16/canva-ai-20-launches-with-new-features-and-conversational-ai/)
- [Canva AI: Guide to Magic Studio (2026)](https://pasqualepillitteri.it/en/news/601/canva-ai-magic-studio-guide)
- [Canva Newsroom: Magic Studio](https://www.canva.com/newsroom/news/magic-studio/)
