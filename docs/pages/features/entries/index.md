---
title: Einträge Bestimmen
layout: default
nav_order: 4
parent: Funktionen
---

# {{page.title}}

## Einträge-Datei
Die Einträge des Radars werden duch eine Einträge-Datei bestimmt. In diesem Projekt ist diese Datei eine YAML-Datei die wie unten aufgebaut ist. Für die Erstellung des Radars wird diese YAML-Datei vorher in JSON-Format konvertiert. 


{% highlight yaml %}
- name: 'Hospitation'
  sectorID: 2
  ringID: 5
  stateID: 2
  active: true
  link: '/intiaRadar_Pages/hospitation.html'
  moved: -1
- ...
{% endhighlight %}

|   Name   |   Type   | Beschreibung |
| -------- | -------- | ------------ |      
|  name | String  | Bestimmt den Namen des Eintrags. |
|  sectorID | Number  | Legt fest in welchen Sektor der Eintrag plaziert werden soll. ID muss einem Index in der `sectors`-liste der Sturktur-JSON entsprechen. |
|  ringID | Number  | Legt fest in welchen Ring/Segment der Eintrag plaziert werden soll. ID muss einem Index in der `rings`-liste der Sturktur-JSON entsprechen.|
|  stateID | Number  | Legt fest welchen Status der Eintrag hat. ID sollte einem Index in der `entryStates`-liste der Sturktur-JSON entsprechen.  |
|  active | Boolean  | Steuert ob der Eintrag im Radar zu sehen ist oder nicht. |
|  link | String  | Legt einen Link zu einer Seite fest, die den Eintrag genauer beschreibt. |
|  moved | Number  | Legt fest ob der Eintrag sich bewegt hat. |