# LogiTrack Datenmodell MVP

## Kunde
- id
- kontoNr
- firmenname
- ansprechperson
- adresse
- ort
- plz
- email
- telefon
- branche
- sprache

## Fahrer
- id
- name
- vorname
- telefon
- lenkzeitStunden
- fuehrerscheinKat
- verfuegbarkeit
- spezifikationen[]

## Fahrzeug
- id
- kontrollschild
- seriennummer
- interneNummer
- fahrzeugTyp
- status
- serviceDatum
- mfkDatum

## Sendung
- id
- kundenId
- fahrerId
- fahrzeugId
- startadresse
- zieladresse
- erfassungsdatum
- lieferdatum
- status
- prioritaet
- lieferungTyp
- gewichtKg
- benachrichtigung
- bemerkungen

## Beziehungen
- ein Kunde hat viele Sendungen
- ein Fahrer hat viele Sendungen
- ein Fahrzeug hat viele Sendungen
- eine Sendung referenziert Kunde, Fahrer und Fahrzeug ueber IDs