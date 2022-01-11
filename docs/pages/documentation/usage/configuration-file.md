---
layout: default
title: Konfigurations Datei
grand_parent: Dokumentation
parent: Verwendung
nav_order: 3
---

# {{page.title}}

## Radar
{% highlight yaml %}
radar:
  id: "intiaRadar"
  headline: "INTIA Method Radar"
  defaultColor: "rgba(255, 255, 255, 0)"
  renderResolution: 1000
{% endhighlight %}
- `id:` Die hier gesetzte ID muss mit der ID des `<div>`-Tags übereinstimmen, in dem das Radar konstruiert werden soll.
- `headline:` Legt den Titel des Radars fest.
- `defaultColor:` Legt die standard Farbe des Radar Hintergrundes fest.
- `renderResolution:` In dieser Auflösung wird das Radar inizial generiert, später skaliert sich die Auflösung dynamisch zu dem `<div>`-Tag.



## Sektor
{% highlight yaml %}
sector:
  useColor: false
  showHeadline: true
{% endhighlight %}
- `useColor:` Legt fest ob jeder Sektor seine individuelle hinterlegte Farbe als Hintergrundfarbe benutzten soll.
- `showHeadline:` Legt fest ob auf dem äußerstem Bogen des Sektors der Titel angezeigt wird. 



## Segment
{% highlight yaml %}
segment: 
  colorGradient: false
  colorGradientLigther: true
  colorLigthnessMin: 0.4
  colorLigthnessMax: 0.8
  showHeadline: true
  firstSegmentRadiusPercent: 0.25  
  padding: 2

  firstMinRadiusPixel: 9
  headlineOffset: 8
  useIdAsHeadline: true
{% endhighlight %}
- `colorGradient:` Legt fest ob die Segmente eines Sektors nach außen hin einen Farbverlauf haben sollen. 
  - Dieser Verlauf kann mit `colorGradientLigther` heller oder dunkler eingestellt werden. 
  - Die obergrenze und untergrenze der Helligkeit kann mit `colorLigthnessMin` und `colorLigthnessMax` eingestellt werden. Die Helligkeit wird in Prozent angegeben (1.0 = 100%; 0.4 = 40%; 0.0 = 0%).
- `showHeadline:` Legt fest ob im Radar die Segment Titel zu sehen sind oder nicht.
- `firstSegmentRadiusPercent:` Die Dicke der Segmente im Radar wird in Prozent gleichmäßig unterteilt. Da aber dann die Fläche des Ersten Segments viel kleiner als die der anderen wäre kann man hier die Dicke des Ersten Segments in Prozent festlegen. 
- `padding:` Legt den Abstand zum Rand vom Segment für die Blips fest. Wichtig die Liniendicke des Randes muss mit berücksichtigt werden.



## Blip
{% highlight yaml %}
blip:
  size: 18
  inactiveColor: '#ddd'
  margin: 1
    
print_layout: false
{% endhighlight %}
- `size:` In diesem Durchmesser werden die Blips inizial generiert.
- `inactiveColor:` 
- `margin:` Legt den Abstand zu den anderen Blips im Radar fest.

