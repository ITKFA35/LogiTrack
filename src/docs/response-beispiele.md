# Beispiel API Responses

## GET /sendungen

```json
[
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
]

## POST /sendungen

```json
{
  "kundenId": 1,
  "fahrerId": 1,
  "fahrzeugId": 2,
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
  "erfassungsdatum": "2026-04-08",
  "lieferdatum": "2026-04-12",
  "status": "offen",
  "prioritaet": "normal",
  "lieferungTyp": "Paket",
  "gewichtKg": 55,
  "benachrichtigung": false,
  "bemerkungen": "API Test Sendung"
}

## Beispiel Validierungsfehler

```json
{
  "error": "Validierungsfehler: startadresse fehlt, zieladresse fehlt, ungueltiger status: falsch"
}

## GET /sendungen?status=offen&prioritaet=hoch

```json
[
  {
    "id": 1008,
    "kundenId": 4,
    "fahrerId": 3,
    "fahrzeugId": 3,
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
    "lieferdatum": "2026-04-09",
    "status": "offen",
    "prioritaet": "hoch",
    "lieferungTyp": "Paket",
    "gewichtKg": 65,
    "benachrichtigung": true,
    "bemerkungen": "Empfang vorab anrufen"
  }
]