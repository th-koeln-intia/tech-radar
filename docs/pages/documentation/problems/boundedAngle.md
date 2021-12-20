---
layout: default
title: Begrenzter Winkel
parent: Probleme
grand_parent: Dokumentation
nav_order: 2
# use_math: true
---

# {{page.title}}

### Problem
Bei vier Sektoren(Quadranten) ist das sehr einfach lösbar, wenn man an ein Koordinatensystem denkt. Im Anfangszustand wurde dafür eine Funktion `boundedBox()` benutzt, die wie der Name schon denken lässt eine 'Box' über die Außenpunkte des Sektors legt. 

![4 Quadranten im Koordinatensystem](/assets/quadrants.svg "4 Quadranten im Koordinatensystem")

Immer wenn ein Blip durch die Kollisionssimulation aus dieser 'Box' gedrückt wurde, also der X oder Y Wert nicht im Bereich des Sektors liegt, wurde dieser wieder an den Rand des Sektors geschoben mit einem gewissen Offset(hier <span style="color:#fff; background-color:#b8c47f">grün</span> markiert), damit die Blips nicht über die Linien kommen.
![boundedBox](/assets/boundedBox.svg "boundedBox")

Wenn nun aber **mehr** Sektoren dargestellt werden sollen, kommt es zu folgendem Problem:

![boundedBox Problem](/assets/boundedBoxProblem.png "boundedBox Problem")

### Lösung
