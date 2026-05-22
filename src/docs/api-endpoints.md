# LogiTrack API Struktur MVP

## Sendungen
- GET /sendungen
  - gibt alle Sendungen zurueck

- GET /sendungen/:id
  - gibt eine einzelne Sendung zurueck

## Fahrzeuge

- GET /fahrzeuge
  - gibt alle Fahrzeuge zurueck

- GET /fahrzeuge/:id
  - gibt ein einzelnes Fahrzeug zurueck

- POST /fahrzeuge
  - erstellt ein neues Fahrzeug

- PUT /fahrzeuge/:id
  - aktualisiert ein Fahrzeug vollstaendig

- DELETE /fahrzeuge/:id
  - loescht ein Fahrzeug

## Fahrer

- GET /fahrer
- GET /fahrer/:id

## Kunden

- GET /kunden
- GET /kunden/:id

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

## Fahrzeug Validierung

Geprueft werden:

- Pflichtfelder
- erlaubte fahrzeugKategorie
- erlaubte fahrzeugArt
- erlaubte Statuswerte
- positive Nutzlast
- positive Palettenplaetze
- gueltiges MFK Datum
- Kilometerstaende logisch

## Filter fuer Sendungen

- GET /sendungen?status=offen
- GET /sendungen?prioritaet=hoch
- GET /sendungen?kundenId=1
- GET /sendungen?status=offen&prioritaet=hoch

Diese Filter koennen einzeln oder kombiniert verwendet werden.

## Filter fuer Fahrzeuge

- GET /fahrzeuge?status=verfügbar
- GET /fahrzeuge?fahrzeugKategorie=lkw
- GET /fahrzeuge?fahrzeugArt=koffer
- GET /fahrzeuge?status=wartung&fahrzeugKategorie=szm

Diese Filter koennen einzeln oder kombiniert verwendet werden.

## Fahrzeug Statuswerte

- verfügbar
- in_nutzung
- wartung
- reserviert
- gesperrt

## Sendung Statuswerte

- offen
- zugewiesen
- wartet
- unterwegs
- geliefert


### Beispiel Fahrzeug

```json
{
  "id": 1,
  "interneNummer": "LKW-005",
  "kennzeichen": "FR-555",
  "marke": "Mercedes-Benz",
  "modell": "Actros",
  "fahrzeugKategorie": "lkw",
  "fahrzeugArt": "koffer",
  "status": "verfügbar"   
}
```
### Beispiel Sendung

```json
{
    "id": 1001,
    "kundenId": 1,
    "fahrerId": 2,
    "fahrzeugId": 1,
    "startStrasse": "Spitalgasse",
    "startHausnummer": "12",
    "startPlz": "3004",
    "startOrt": "Bern",
    "startLand": "CH",
    "zielStrasse": "Industriepark",
    "zielHausnummer": "4",
    "zielPlz": "3600",
    "zielOrt": "Thun",
    "zielLand": "CH",
    "erfassungsdatum": "2026-04-07",
    "lieferdatum": "2026-04-08",
    "status": "unterwegs",
    "prioritaet": "hoch",
    "lieferungTyp": "Palette",
    "gewichtKg": 350,
    "benachrichtigung": true,
    "bemerkungen": "Vorsicht bei Entladung"
  }
  ```