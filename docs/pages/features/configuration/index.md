---
title: Konfigurierbarkeit
layout: default
nav_order: 2
parent: Funktionen
---

# {{page.title}}

## Konfigurations-Datei
Die Konfiguration des Radars wird duch eine Konfigurations-Datei bestimmt. In diesem Projekt ist diese Datei eine YAML-Datei die wie unten aufgebaut ist. Für die Erstellung des Radars wird diese YAML-Datei vorher in JSON-Format konvertiert. 

### Radar
{% highlight yaml %}
radar:
  id: 'intiaRadar'
  name: 'INTIA Method Radar'
  showName: true
  showAllSectorsText: 'Alle Sektoren'
  legendDropdownText: 'Legende'
  defaultColor: 'rgba(99, 110, 114, 1.0)'
  renderResolution: 410
{% endhighlight %}

|   Name   |   Type   | Beschreibung |
| -------- | -------- | ------------ |      
|  id | String  | Die ID muss mit der ID des `<div>`-Tags übereinstimmen. |
|  name | String  | Definiert den Namen des Radars und kann als Titel über dem Radar angezeigt werden. |
|  showName | Boolean  | Steuert ob der Name des Radars als Titel angezeigt wird. |
|  showAllSectorsText | String  | Text für die Option, alle Sektoren anzuzeigen. |
|  legendDropdownText | String  | Text für den Radar Legenden Button. |
|  defaultColor | String  | Definiert die Standard Farbe des Radars. Kann in rgb-, rgba- oder hexacode angegeben werden. |
|  renderResolution | Number  | Definiert den Durchmesser des Radars. |


### Sektor
{% highlight yaml %}
sector:
  useColor: false
  showName: true
{% endhighlight %}

|   Name   |   Type   | Beschreibung |
| -------- | -------- | ------------ |      
|  useColor | Boolean  | Steuert ob der Sektor Hintergrund in den Sektorfarben dargestellt wird, oder in der Standardfarbe dargestelt wird.  |
|  showName | Boolean  | Steuert ob der Name der Sektoren auf dem äußerstem Bogen der Sektoren angezeigt wird. |


### Segment
{% highlight yaml %}
segment: 
  colorGradient: true
  colorGradientLimit: 1.66
  showName: true
  showNameAsId: true
  padding: 4
{% endhighlight %}

|   Name   |   Type   | Beschreibung |
| -------- | -------- | ------------ |   
|  colorGradient | Boolean  | Steuert ob die Segment Hintergrundfarbe nach außen hin einen Farbverlauf haben soll. |
|  colorGradientLimit | Float  | Bestimmt die Grenze des Farbverlaufs. 1,66 entspricht einer 66% helleren Farbe am äußersten Segment. 0,33 entspricht einer 66% dunkleren Farbe am äußersten Segment. |
|  showName | Boolean  | Steuert ob die Segment Namen im Radar angezeigt werden oder nicht. |
|  showNameAsId | Boolean  | Steuert ob anstelle der Segment Namen die Segment Nummern angezeigt werden sollen. Für den Fall, dass die Segment Namen zu Lang sind um diese Lesbar anzuzeigen. |
|  padding | Number  | Bestimmt den Abstand der Blips vom Rand des Segments. Berücksichtigt nicht die linienbreite des Segments! |


### Blip
{% highlight yaml %}
blip: 
  size: 22
  defaultColor: '#8395a7'
  margin: 2
{% endhighlight %}

|   Name   |   Type   | Beschreibung |
| -------- | -------- | ------------ |   
|  size | Number  | Bestimmt den Duchmesser von Blips. |
|  defaultColor | String  | Bestimmt die Standard Farbe von Blips. |
|  margin | Number  | Bestimmt den minimal Abstand von Blips untereinander. |
