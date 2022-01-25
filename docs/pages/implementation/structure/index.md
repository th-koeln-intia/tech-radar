---
title: JS Aufbau
layout: default
nav_order: 1
parent: Implementation
---

# {{page.title}}

Anforderung für das Radar war es die Möglichkeit zu haben, dass das Radar in Seiten einbettbar sein muss. Am einfachsten ist das, wenn alles in einer Datei steht und nur diese importiert werden muss.

So eine lange Datei ist leider nicht sonderlich leicht lesbar. Dennoch habe ich mich dafür entschieden, weil es einfach einfacher ist, nur eine einzelne Datei zu importieren, anstatt das Radar in mehrere Dateien zu schreiben und nachher wieder in eine Datei zusammen zu packen, um es leichter zu importieren.

Um die Lesbarkeit und Wartbarkeit dieser langen Datei dennoch zu gewährleisten, wurde die Datei in mehrere Regionen gegliedert. Die Regionen sind Visuell von einander getrennt durch die bei den unten folgenden Überschriften angefügten Symbolen in den Klammern. 

## Gliederung der Regionen

### 1. Deklarierung von Konstanten und Variablen (###)
Hier werden Konstanten definiert oder berechnet, die im ganzen Script immer gleichbleiben und somit nur einmal berechnet werden.


### 2. Helper Funktionen (~~~)
Dieser Bereich ist weiter in drei Unterbereiche gegliedert. 
1. Mathematische Funktionen, um zum Beispiel Radi, Winkel oder Punkte zu berechnen.
2. Segment Funktionen zur Berechnung der Segmentgrenzen.
3. SVG Funktionen, um zum Beispiel einen Bogen zu beschreiben für ein SVG-Path.


### 3. Daten Aufbereitung (|||)
Hier werden die Daten aus den übergebenen JSON-Objekten aufbereitet. Die Aufbereiteten Daten werden in einem `radarData`-Objekt gespeichert.
1. Ergänzen der Ring Liste des Radars. Jeder Ring bekommt einen innen und außen Radius. Außerdem bekommt jeder Ring einen Minimal und Maximal Radius für Blips.
2. Ergänzen der Sektoren Liste des Radars. Jeder Sektor bekommt...
    - ... einen Anfangs- und einen Endwinkel (Winkel im Radar sind in Radiant).
    - ... eine Kopie von der Ring Liste, gespeichert als Segmente.
    - ... eine ID.
    - ... eine Farbpalette als Array, hängt von der Konfiguration ab. 
3. Ergänzung der Segmente in den Sektoren. Jedes Segment bekommt...
    - ... den Anfangs- und Endwinkel des jeweiligen Sektors.
    - ... eine Farbe.
    - ... eine Blip-Liste der Einträge aus dem übergebenen JSON-Objekt, alphabetisch sortiert und mit nur den Einträgen die auch als `active` gekennzeichnet wurden.
4. Ergänzung der Blips in den Segmenten. Jeder Blip bekommt...
    - ... eine individuelle ID.
    - ... die Segment Funktionen, des jeweiligen Segments.
    - ... ein Attribut `focused`.
5. Position aller Blips Initiieren.
6. Ergänzen der Blip-Konfiguration um ein paar Attribute die später zum 'zeichnen' der Blips benötigt werden.


### 4. Erstellen der Grundstruktur (___)
Hier wird das `<div>`-Grundgerüst erstellt um später in diesen `<div>`-Tags Komponenten erstellen zu können.

### 5. Event Funktionen (***)
Dieser Bereich ist weiter unterteilt in:
- Generelle Event Funktionen.
- Sektor Event Funktionen.
- Ring Event Funktionen.
- Blip Event Funktionen.
- Bubble Event Funktionen.


### 6. D3-Komponenten (---)
Auf D3-Komponenten wird hier ([D3-Komponenten]) weiter eingegangen.

Dieser Bereich ist weiter unterteilt in:
- Radar Komponenten.
- Radar Legenden Komponenten.
- Radar Bleip Legenden Komponenten.


### 7. Elemente generierung (+++)
Dieser Bereich ist weiter unterteilt in:
- Generierung des Selektion Dropdowns
- Generierung des Radars
- Generierung der Radar Legende
- Generierung der Radar Blip Legende

### 8. Simulation (%%%)
In diesem Bereich befindet sich die D3-Kollisionssimulation 





[D3-Komponenten]: /pages/implementation/d3-components/