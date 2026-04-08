# Beispiel API Responses

## GET /sendungen

```json
[
  {
    "id": 1001,
    "kundenId": 1,
    "fahrerId": 2,
    "fahrzeugId": 1,
    "startadresse": "Bern, Spitalgasse 12",
    "zieladresse": "Zuerich, Lagerstrasse 5",
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
  "startadresse": "Bern, Testweg 1",
  "zieladresse": "Zuerich, Teststrasse 99",
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