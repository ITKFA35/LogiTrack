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
- id
- interneNummer
- kennzeichen
- vin

- marke
- modell

- fahrzeugKategorie
- fahrzeugArt

- status

- mfkDatum

- aktuellerKmStand
- letzteWartungKm
- naechsteWartungKm

- nutzlastKg
- palettenPlaetze

### fahrzeugKategorie

- lkw
- szm
- transporter
- anhaenger
- auflieger

### fahrzeugArt

- pritsche_plane
- koffer
- kuehler
- tank
- silo
- tieflader

### status

- verfügbar
- in_nutzung
- wartung
- reserviert
- gesperrt

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