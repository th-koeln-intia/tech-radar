---
title: Home
layout: default
nav_order: 1
---

# Übersicht
Auf dieser Seite bekommen Sie einen Überblick über die Verwendung, Konfiguration und Entwicklung des Radars.

## Projekt Kontext
Dieses Projekt ist ein Unterprojekt der INTIA-Plattform, dort werden Ideen zur partizipativen und inklusiven Technik-entwicklung präsentiert werden. Auf dieser Plattform soll das Radar als Methoden-Radar zu Orientierung für Methoden in künftige Projekte dienen.

_Das Radar ist Data-Radar benannt worden, weil durch die Konfigurationsmögllichkeiten vom Radar ist die Darstellung nicht nur auf Methoden beschränkt._

Der Anfangsaustand des Projekts basiert auf dem [Zalando Tech Radar][zalando-tech-radar]. Mit diesem Radar zeigt Zalando im 6 Monats Abstand Technologie Trend in deren Projekten. 

## Ziele des Projekts
Aus dem Anfangszustand haben sich folgende Ziele des Projekts ergeben:
1. Als Gesamtziel soll das Radar später in eine statische Seite einbettbar sein, dazu muss folgendes umgesetzt werden:
    1. Das Radar muss sich dem Bildschirm anpassen.
    2. Die Radar Ansicht muss sich auf Mobilendgeräten so anpassen, dass es gut lesbar bleibt.
2. Die Umsetzung soll übersichtlich und leicht verständlich realisiert werden für eventuelle spätere Anpassungen oder Fehlerbehebungen. 
3. Der Dargestellte Inhalt des Radars ist in einer Datei geschrieben, diese soll für eine bessere Übersicht und wartbarkeit aufgeteilt werden.
4. Das Radar soll konfigurierbar sein in wie viele Ringe oder Sektoren das Radar unterteilt ist.
5. Die Radar Daten sollen als YAML-Datei eingelesen werden können.

[zalando-tech-radar]: https://opensource.zalando.com/tech-radar/