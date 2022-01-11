---
title: Home
layout: default
nav_order: 1
---

# Übersicht
Auf dieser Seite bekommen Sie einen Überblick über die Verwendung, Konfiguration und Entwicklung des Radars.

### Projekt Kontext
Dieses Projekt ist ein Unterprojekt der INTIA-Plattform, dort werden Ideen zur partizipativen und inklusiven Technik-entwicklung präsentiert werden. Auf dieser Plattform soll das Methoden-Radar zu Orientierung für Methoden in künftige Projekte dienen.

## Anfangszustand des Projekts
Der Anfangsaustand basiert auf dem [Zalando Tech Radar][zalando-tech-radar] und sah folgendermaßen aus:

![Anfangs Zustand](/assets/project_start_state.png "Anfangs Zustand")

## Ziele des Projekts
Aus dem Anfangszustand haben sich folgende Ziele des Projekts ergeben:
1. Als Gesamtziel soll das Radar später in eine statische Seite einbettbar sein, dazu muss folgendes umgesetzt werden:
    1. Das Radar muss sich dem Bildschirm anpassen.
    2. Die Radar Ansicht muss sich auf Mobilendgeräten so anpassen, dass es gut lesbar bleibt.
2. Zum aktuellen Stand ist das Radar in einer langen JavaScript-Datei geschrieben. Zur späteren besseren Wartung des Radars für eventuelle Anpassungen oder Fehlerbehebung soll diese Datei sinnvoll in mehrere Dateien aufgeteilt werden.
3. Auch der Dargestellte Inhalt des Radars ist in einer Datei geschrieben, auch hier soll wie im Punkt 2 diese aufgeteilt werden.
4. Das Radar soll konfigurierbar sein in wie viele Ringe oder Sektoren das Radar unterteilt ist.
5. Die Radar Daten sollen als YAML-Datei eingelesen werden können.



[zalando-tech-radar]: https://opensource.zalando.com/tech-radar/