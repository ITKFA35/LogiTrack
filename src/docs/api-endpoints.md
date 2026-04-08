# LogiTrack API Struktur MVP

## Sendungen
- GET /sendungen
  - gibt alle Sendungen zurueck

- GET /sendungen/:id
  - gibt eine einzelne Sendung zurueck

## Fahrzeuge
- GET /fahrzeuge
  - gibt alle Fahrzeuge zurueck

## Fahrer
- GET /fahrer
  - gibt alle Fahrer zurueck

## Kunden
- GET /kunden
  - gibt alle Kunden zurueck

## Dashboard
- GET /dashboard/stats
  - gibt Kennzahlen fuer das Dashboard zurueck

## Schreiboperationen

- POST /sendungen
  - erstellt eine neue Sendung

- PUT /sendungen/:id
  - aktualisiert eine bestehende Sendung vollstaendig

- DELETE /sendungen/:id
  - loescht eine bestehende Sendung

## Validierung
Vor POST und PUT werden Sendungsdaten geprueft.

Geprueft werden:
- Pflichtfelder
- erlaubte Statuswerte
- erlaubte Prioritaeten
- erlaubte Lieferungstypen
- positives Gewicht
- gueltige Datumsreihenfolge  