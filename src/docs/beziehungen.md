# Beziehungen im LogiTrack MVP

## Kunde -> Sendung
Ein Kunde kann mehrere Sendungen haben.
Beziehung: 1:n

Verknuepfung:
- sendungen.kundenId -> kunden.id

## Fahrer -> Sendung
Ein Fahrer kann mehreren Sendungen zugewiesen sein.
Beziehung: 1:n

Verknuepfung:
- sendungen.fahrerId -> fahrer.id

## Fahrzeug -> Sendung
Ein Fahrzeug kann mehreren Sendungen zugewiesen sein.
Beziehung: 1:n

Verknuepfung:
- sendungen.fahrzeugId -> fahrzeuge.id

## Hinweis
In der MVP-Version werden Beziehungen ueber IDs abgebildet.
Die aufgeloesten Detaildaten werden in der api.js zusammengefuehrt.