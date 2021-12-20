---
title: Objekte
layout: default
nav_order: 2
grand_parent: Dokumentation
parent: Aufbau
---

# {{page.title}}


### Radar-Objekt

Bei der Iniziierung wird als erstes ein **Radar-Objekt** erstellt, in diesem werden alle Daten gespeichert. Dieses Radar-Objekt hat folgende Attribute:

| Name | Type | Beschreibung |
| -------- | -------- | -------- |      
|  CONFIG | Object  | Objekt von der Konfiguration JSON-Datei  |
|  ENTRIES | Object  | Objekt von der Einträge JSON-Datei |
|  STRUCTURE | Object  | Objekt von der Struktur JSON-Datei |
|  DIV | HTMLDivElement  | `<div>`-Tag vom gesamten Radar |
|  NAME | String  | Name des Radar (ID aus der Konfiguration) |
|  WIDTH | Number  | Renderbreite des Radar, aus der Konfiguration |
|  RADIUS | Number  | Die hälfte der Renderbreite |
|  blip_id_counter | Number  | Zähler Attribut, zum Hochzählen einer jeweils individuellen ID für Blips im Radar |
|  show_sector | Number  | Wenn >= 0, dann wird im Radar nur der Sektor mit dieser ID angezeigt. Wenn < 0, also negativ wird das gesammte Radar mit allen Sektoren angezeigt. |
|  seed | Number  | Wird zum wiederholbar zufälligen Positionieren der Blips im Radar benutzt.  |
|  sectors | Array  | Array aus Sector-Objekten |
|  rings | Array  | Array aus Ring-Objekten |
|  update | Function  | Funktion die das Anzeigen oder nicht Anzeigen von elementen im Radar anstößt |


### Sektor-Objekt

Zu jedem Eintrag unter ``sectors`` in der Struktur-JSON, wird ein Sektor-Objekt erstellt. Ein Sektor-Objekt hat folgende Attribute:

| Name | Type | Beschreibung |
| -------- | -------- | -------- |      
|  RADAR | Object  | Vater Objekt  |
|  id | Number  | Sektor ID  |
|  name | String  | Sektor Name  |
|  idText | String  | Sektor ID als Textform für HTML-Elemente (Zusammensetztung => `[RadarID]_sector[SectorID]`)   |
|  buttonDiv | HTMLDivElement  | `<div>`-Tag des Sektor Buttons im Selektion Bereich des Radars  |
|  svgGroup | Object  | SVG Gruppen Element im Radar  |
|  legendDiv | HTMLDivElement  | `<div>`-Tag des Sektor, im Blip Legenden Bereich des Radars |
|  startAngle | Number  | Start Winkel des Sektors, ab wie viel Grad beginnt der Sektor in einem Einheitskreis.  |
|  endAngle | Number  | End Winkel des Sektors, bei wie viel Grad endet der Sektor in einem Einheitskreis.  |
|  segments | Array  | Array aus Segment-Objekten, für jeden Eintrag in ``RADAR.rings`` wird ein Segment-Objekt erstellt  |


### Segment-Objekt

| Name | Type | Beschreibung |
| -------- | -------- | -------- |      
|  SEKTOR | Object  | Vater Objekt  |
|  id | Number  | ID des Segments  |
|  name | String  | Name/Titel des Segments/Rings  |
|  idText | String  | Segment ID als Textform für HTML-Elemente (Zusammensetztung => `[SEKTOR.idText]_segment[SegmentID]`)  |
|  svgGroup | Object  | SVG Gruppen Element im Radar  |
|  segmentFunction | Object  | Beinhaltet zwei Funktionen, die Erste (`clip`) zum sicherstellen das Blips im Segment bleiben, die Zweite (`random`) um eine zufällige iniziierungs Position für Blips zu bekommen |
|  polarMin | Object  | TODO  |
|  polarMax | Object  | TODO  |
|  blips | Array  | Array aus Blip-Objekten, TODO  |


### Blip-Objekt

| Name | Type | Beschreibung |
| -------- | -------- | -------- |      
|  SEGMENT | Object  | Vater Objekt  |
|  id | Number  | ID des Blips  |
|  lable | String  | Name/Label des Blips  |
|  link | String  | Link zu einer Seite, die näheres zu dem Blip erklärt  |
|  moved | Number  | Negativ = Blip ist ein Segment nach außen gewandert; 0 = Blip ist unverändert in diesem Segment geblieben; Positiv = Blip ist ein Segment nach inne gewandert  |
|  x | Number  | x Koordinaten des Blips  |
|  y | Number  | y Koordinaten des Blips  |
|  stateID | Number  | Status des Blips  |

