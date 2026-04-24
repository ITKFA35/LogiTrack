# LogiTrack Validierungsregeln MVP

## Sendung
Pflichtfelder:
- id
- kundenId
- startStrasse
- startHausnummer
- startPlz
- startOrt
- startLand
- zielStrasse
- zielHausnummer
- zielPlz
- zielOrt
- zielLand
- erfassungsdatum
- lieferdatum
- status
- prioritaet
- lieferungTyp
- gewichtKg

Optionale Felder:
- fahrerId
- fahrzeugId
- benachrichtigung
- bemerkungen

Erlaubte Statuswerte:
- offen
- zugewiesen
- wartet
- unterwegs
- geliefert

Erlaubte Prioritaeten:
- niedrig
- normal
- hoch

Erlaubte Lieferungstypen:
- Paket
- Palette

## Fahrzeug
Pflichtfelder:
- id
- kontrollschild
- seriennummer
- interneNummer
- fahrzeugTyp
- status

Erlaubte Statuswerte:
- frei
- unterwegs
- wartung

## Fahrer
Pflichtfelder:
- id
- name
- vorname
- telefon
- fuehrerscheinKat
- verfuegbarkeit

## Kunde
Pflichtfelder:
- id
- kontoNr
- firmenname
- ansprechperson
- adresse
- ort
- plz
- email
- telefon