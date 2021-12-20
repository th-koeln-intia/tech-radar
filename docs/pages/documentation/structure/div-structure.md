---
title: Div Struktur
layout: default
nav_order: 1
grand_parent: Dokumentation
parent: Aufbau
---

# {{page.title}}

Das Gesamte Radar wird in einem `<div>`-Tag konstruiert. Dieser Tag ist in 5 Hauptbereiche untereinander gegliedert. Jeder dieder Bereiche auch als `<div>`-Tag.

### Titel
Hier wird der Titel des Radars dargestellt.

### Selektion
Hier werden dynamisch Buttons erstellt/dargestellt. Zu jedem Sektor des Radars wird hier ein Button erstellt, plus ein Button für das gesamte Radar. Beim klicken auf einen der Buttons wird dann nur der eine Sektor im Radar dargestellt oder das ganze Radar. 

Der Button zum anzeigen des Gesamten Radars wird dynamisch dargestellt. Wenn der Darstellungsbereich kleiner ist als in der Konfigurationsdatei angegebenen Mindestbreite wird der Button ausgeblendet, wenn er größer ist wird er angezeigt.

Somit ist eine gute Lesbarkeit des Radars auch auf Mobilenendgeräten gegeben, dann jedoch nur Sektor für Sektor.

### Radar
Hier wird das Radar dargestellt. Das Radar ist in __Sektoren__ gegliedert, jeder Sektor steht für einen Themenbereich der in dem Radar abgebildet wird. Jeder Sektor ist weiter unterteil in mehrere **Segmente**, dieses steht für den Stellenwert in diesem Themenbereich. In jedem Segmente des Radars werden dann **Blips**(Punkt auf dem Radar) dargestellt. 

Sektoren, Segmente und Blips können als Komponenten betrachtet werden, deren Aufbau wird hier ([Radar-Objekte]) gezeigt/erklärt.

###  Radar Legend
Hier werden die im Radar dargestellten Segmente/Ringe und die verschiedenen Blip Zustände beschrieben.

### Blip Legend
Hier werden die Inhalte der Sektoren als Blöcke in Textform dargestellt. Als Inhalt eines solchen Blocks werden die Segmente eines Sektors mit den darin befindlichen Blips aufgelistet.

Auch hier ist die Darstellung dieser Blöcke dynamisch, ...\
...wird das gesamte Radar dargestellt, werden auch alle Sektoren als Blöcke hier dargestellt.\
...wird nur ein bestimmter Sektor im Radar dargestellt, wird nur dieser Sektor als Block dargestellt. 



[Radar-Objekte]: /pages/documentation/structure/objects.html