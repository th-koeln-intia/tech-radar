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
|  CONFIG | Object  | Objekt von der Konfiguration JSON-Datei  |
|  CONFIG | Object  | Objekt von der Konfiguration JSON-Datei  |
|  CONFIG | Object  | Objekt von der Konfiguration JSON-Datei  |