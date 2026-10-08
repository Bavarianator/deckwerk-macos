// Übersicht aller Tastenkürzel und Mausgesten; öffnet mit „?“ oder über den Knopf in der Kopfleiste (TopBar).
import { useEffect, useRef } from 'react'

const GROUPS: { name: string; keys: [string, string][] }[] = [
  { name: 'Allgemein', keys: [
    ['⌘S', 'Speichern'], ['⌘Z', 'Rückgängig'], ['⌘⇧Z oder ⌘Y', 'Wiederholen'], ['/', 'Wunsch an die KI'],
    ['⌘F', 'Im ganzen Deck suchen'], ['⌘H', 'Suchen und ersetzen'],
    ['?', 'Diese Übersicht'], ['⌥⌘P', 'Präsentieren ab Folie 1'], ['⌥⇧⌘P', 'Präsentieren ab dieser Folie'],
    ['← → bzw. Bild↑ Bild↓', 'Folie wechseln (wenn nichts ausgewählt ist)'],
  ] },
  { name: 'Ansicht', keys: [['⌘Mausrad oder ⌘Plus/Minus', 'Zoomen'], ['⌘0', 'Einpassen']] },
  { name: 'Einfügen', keys: [
    ['T', 'Text'], ['R', 'Rechteck'], ['C', 'Kreis'], ['L', 'Linie'], ['⌘V', 'Einfügen (auch Bilder aus der Zwischenablage)'],
    ['Dateien auf die Folie ziehen', 'Bild, Video oder Audio einfügen'],
  ] },
  { name: 'Elemente', keys: [
    ['Klick', 'Auswählen'], ['⇧Klick', 'Zur Auswahl hinzufügen'], ['Rahmen aufziehen', 'Mehrere auswählen'], ['⌘A', 'Alle auswählen'],
    ['Tab / ⇧Tab', 'Nächstes / voriges Element'], ['Pfeiltasten', 'Verschieben (mit ⇧ 10 px)'],
    ['⇧ beim Ziehen', 'Nur waagerecht oder senkrecht'], ['⌥ beim Ziehen', 'Kopie ziehen'], ['⌘ beim Ziehen', 'Ohne Einrasten'],
    ['⇧ an einer Ecke', 'Seitenverhältnis frei bzw. fest'], ['⇧ beim Drehen', 'In 15°-Schritten'],
    ['Doppelklick', 'Text bearbeiten, Bild zuschneiden, in Gruppe wählen'], ['Enter', 'Text bearbeiten'], ['Esc', 'Auswahl aufheben'],
    ['⌫', 'Löschen'], ['⌘C / ⌘X', 'Kopieren / Ausschneiden'], ['⌘D', 'Duplizieren'], ['⌘G', 'Gruppieren'],
    ['⌘⇧G', 'Gruppierung aufheben'], ['⌘L', 'Sperren'], ['⌘] / ⌘[', 'Eine Ebene nach vorne / hinten'],
    ['⌘⇧] / [', 'Ganz nach vorne / hinten'], ['⌥⌘C', 'Stil kopieren'], ['⌥⌘V', 'Stil übertragen'],
  ] },
  { name: 'Text', keys: [
    ['⌘B', 'Fett'], ['⌘I', 'Kursiv'], ['⌘U', 'Unterstrichen'], ['⌘⇧K', 'Großbuchstaben'],
    ['⌘⇧L / C / R', 'Links / mittig / rechts'], ['⌘⇧, / .', 'Kleiner / größer'],
  ] },
  { name: 'Zuschneiden', keys: [['Enter', 'Übernehmen'], ['Esc', 'Verwerfen']] },
  { name: 'Folien im Filmstreifen', keys: [
    ['Rechtsklick', 'Folienmenü'], ['⌘C / ⌘V', 'Folie kopieren / einfügen'], ['⌘D', 'Duplizieren'], ['⌫', 'Löschen'], ['Ziehen', 'Umsortieren'],
  ] },
  { name: 'Raster-Ansicht', keys: [
    ['⌘Klick', 'Einzeln auswählen'], ['⇧Klick', 'Bereich auswählen'], ['⌘A', 'Alle auswählen'],
    ['⌘C / ⌘V', 'Kopieren / einfügen'], ['⌫', 'Löschen'], ['Doppelklick', 'Folie öffnen'],
  ] },
  { name: 'Präsentieren', keys: [
    ['→ / Leertaste / Klick', 'Weiter'], ['← / Rechtsklick', 'Zurück'], ['Pos1 / Ende', 'Erste / letzte Folie'], ['Zahl + Enter', 'Zu Folie springen'],
    ['B', 'Pause (Folie unscharf)'], ['P', 'Referentenansicht'], ['L', 'Laserpointer'], ['D', 'Stift'], ['E', 'Zeichnung löschen'], ['Esc', 'Beenden'],
  ] },
]

export function ShortcutSheet({ onClose }: { onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null)
  useEffect(() => box.current?.focus(), [])
  return (
    <div className="look" ref={box} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Tastenkürzel"
      onKeyDown={(e) => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose() } }}>
      <header className="top">
        <div className="top-l" />
        <b>Tastenkürzel</b>
        <div className="top-r"><button className="plain tint" onClick={onClose}>Schließen</button></div>
      </header>
      <div className="keys-body" onClick={(e) => { if (!(e.target as HTMLElement).closest('h2, dt, dd')) onClose() }}>
        <div className="keys-cols">
          {GROUPS.map((g) => (
            <section key={g.name}>
              <h2>{g.name}</h2>
              <dl>{g.keys.map(([k, d]) => <div key={k + d}><dt><kbd>{k}</kbd></dt><dd>{d}</dd></div>)}</dl>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
