---
title: Struktur Bestimmung
layout: default
nav_order: 3
parent: Funktionen
---

# {{page.title}}

## Sektoren

Im Radar werden Sektoren automatisch generiert, dies geschiet anhand der Liste von Sektoren in der Struktur-JSON. Abhängig davon wie viele Sektoren in der Liste sind, wird das Radar in gleichmäßige Stücke/Sektoren aufgeteilt.

{% highlight yaml %}
sectors:
  - name: 'Deliver'
    color: '#3498db'
  - ...
{% endhighlight %}

|   Name   |   Type   | Beschreibung |
| -------- | -------- | ------------ |      
|  name | String  | Bestimmt den Namen des Sektors. |
|  color | String  | Bestimmt die Hintergrundfarbe des Sektors. |


## Ringe

Im Radar werden Ringe automatisch generiert, dies geschiet anhand der Liste von Ringen in der Struktur-JSON. Abhängig davon wie viele Ringe in der Liste sind, wird der Radius des Radars in gleichmäßig dicke Teile eingeteilt.

{% highlight yaml %}
rings:
  legendTitle: 'Ringe/Segmente'
  list:
    - name: 'Entscheidungsmacht'
    - ...
{% endhighlight %}

|   Name   |   Type   | Beschreibung |
| -------- | -------- | ------------ |      
|  legendTitle | String  | Bestimmt die Überschrift in der Radar Legende für Ringe im Radar. |
|  list | Array  | Liste der Ringe im Radar. |
|  name | String  | Bestimmt den Namen des Rings. |


## Blip Zustände

Im Radar können Blips verschiedene Zustände haben diese können in der Struktur-JSON wie folgt erstellt werden.

{% highlight yaml %}
entryStates:
  legendTitle: 'Zustände'
  list:
    - name: 'Methode nach Lehrbuch'
      color: '#10ac84'
    - ...
{% endhighlight %}

|   Name   |   Type   | Beschreibung |
| -------- | -------- | ------------ |      
|  legendTitle | String  | Bestimmt die Überschrift in der Radar Legende für Blip Zustände im Radar. |
|  list | Array  | Liste der Blip Zustände im Radar. |
|  name | String  | Bestimmt den Namen des Zustandes. |
|  color | String  | Bestimmt die Farbe des Zustandes. |


## Blip Bewegungen

Im Radar können Bewegungen von Blips dargestellt werden. Wenn zum Beispiel ein Blip in der vorigen Veröffentlichung im dritten Ring lag und in der neuen Veröffentlichung im zweiten Ring liegt, kann diese Bewegung nach Innen dargestellt werden.

Diese Liste ist nicht erweiterbar! Außer neue Einträge werden in der `radar.js` implementiert.

{% highlight yaml %}
entryMovement:
  legendTitle: 'Bewegung'
  list:
    - name: 'Nach Innen'
      value: 1
    - name: 'nach Außen'
      value: -1
    - name: 'Keine'
      value: 0
{% endhighlight %}

|   Name   |   Type   | Beschreibung |
| -------- | -------- | ------------ |      
|  legendTitle | String  | Bestimmt die Überschrift in der Radar Legende für Blip Bewegungen im Radar. |
|  list | Array  | Liste der Blip Bewegungen im Radar. |
|  name | String  | Bestimmt den Namen der Bewegung. |
|  value | Number  | Wert der Bewegung. |