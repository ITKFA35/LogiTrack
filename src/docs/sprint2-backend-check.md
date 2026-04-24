# Sprint 2 Backend Check - Björn

## API Funktionen
- GET /sendungen
- POST /sendungen
- PUT /sendungen/:id
- PATCH /sendungen/:id
- DELETE /sendungen/:id

## Wichtige Felder fuer Frontend
- id
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
- status
- prioritaet
- lieferdatum

## Validierung
Folgende Prüfungen sind implementiert:

- Pflichtfelder (startadresse, zieladresse, status, prioritaet)
- Leere Strings werden erkannt
- Ungueltige Statuswerte werden abgelehnt
- Ungueltige Prioritaeten werden abgelehnt
- Ungueltige Lieferungstypen werden abgelehnt
- Gewicht muss positiv sein
- Lieferdatum darf nicht vor Erfassungsdatum liegen

## Statuslogik
- Statuswechsel wird geprüft (PATCH)
- Ungueltige Statuswechsel werden verhindert

## Frontend Nutzung
- POST fuer Formular (Sendung erstellen)
- PUT fuer Bearbeiten
- PATCH fuer Statusänderung
- DELETE fuer Tabellenaktion

## Fazit
Backend ist bereit fuer Integration mit Frontend und Testing (Sprint 2)